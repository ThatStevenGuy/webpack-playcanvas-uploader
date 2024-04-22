export class ConsoleLogger {
    public readonly tag: string;

    public constructor(tag: string) {
        this.tag = tag;
    }

    public log(...data: any[]): void {
        this.logByMethod(console.log, data);
    }

    public warn(...data: any[]): void {
        this.logByMethod(console.warn, data);
    }

    public error(...data: any[]): void {
        this.logByMethod(console.error, data);
    }

    private logByMethod(logMethod: (...data: any[]) => void, data: readonly any[]): void {
        if(data.length === 0) {
            return;
        }

        if(typeof data[0] === "string") {
            logMethod(`[${this.tag}] ${data[0]}`, ...data.slice(1));
        } else {
            logMethod(...data);
        }
    }
}