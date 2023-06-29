export default class Spinner {
    constructor(private msg: string) {
        this.startSpinner();
    }

    private interval: NodeJS.Timeout | undefined
    
    // Function to start the spinner animation
    public startSpinner = (): void => {
        const spinnerChars = ['|', '/', '-', '\\'];
        let i = 0;

        this.interval = setInterval(() => {
            process.stdout.write(`\r${spinnerChars[i]} ${this.msg} ...`);
            i = (i + 1) % spinnerChars.length;
        }, 100);
    }

// Function to stop the spinner animation
    public stopSpinner = (): void => {
        clearInterval(this.interval);
        // Clear the spinner line
        process.stdout.write(`\r ${this.msg} Done!                           \n`); 
    }
}

