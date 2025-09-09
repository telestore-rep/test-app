interface Task<T = any> {
  resolve: (v: T) => void;
  reject: (reason?: any) => void;
  queryFn: () => Promise<T>;
  maxAttempts: number;
  attempts: number;
}

export class ConcurentQueueError extends Error {
  constructor(readonly time: number) {
    super("rate limit exceed");
  }
}

export class ConcurentQueue {
  private queue: Task[] = [];

  private activeCount = 0;

  public concurrencyLimit = 2;

  public failDelay = 1000;

  public defaultMaxAttempts = 3;

  public tpsLimit = 5; // rate limit

  private tpsExecuted = 0;

  private tpsTimer: NodeJS.Timeout | null = null;

  private delayAfterFail(error: unknown) {
    if (error instanceof ConcurentQueueError) {
      return new Promise(resolve => setTimeout(resolve, error.time));
    }
    return new Promise(resolve => setTimeout(resolve, this.failDelay));
  }

  enqueue<T>(
    queryFn: () => Promise<T>,
    params?: {
      maxAttempts?: number;
    }
  ): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push({
        resolve,
        reject,
        queryFn,
        attempts: 0,
        maxAttempts: params?.maxAttempts || this.defaultMaxAttempts
      });

      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.activeCount >= this.concurrencyLimit || this.tpsExecuted >= this.tpsLimit || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();

    if (!task) return;

    this.activeCount++;
    this.tpsExecuted++;

    if (!this.tpsTimer) {
        this.tpsTimer = setTimeout(() => {
          this.tpsTimer = null;
          this.tpsExecuted = 0;
          this.processQueue();
        }, 1000);
    }

    try {
      const response = await task.queryFn();
      task.resolve(response);
    } catch (err) {
      if (task.attempts < task.maxAttempts) {
        await this.delayAfterFail(err);
        this.queue.push(task);
        task.attempts += 1;
      } else {
        task.reject(err);
      }
    } finally {
      this.activeCount--;
      this.processQueue();
    }
  }
}
