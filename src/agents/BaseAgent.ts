// BaseAgent.ts

/**
 * Base class for all AI Agents.
 */
class BaseAgent {
    private conversationHistory: string[] = [];

    constructor() {
        // Initialization code if necessary.
    }

    /**
     * Main process method for the agent.
     * @param input The input to process.
     */
    public process(input: string): void {
        // Code to process the input.
        this.addToHistory(input);
        // Additional processing logic would go here.
    }

    /**
     * Execute a task with fallback logic and retry mechanism.
     * @param task The task to execute.
     * @param retries Number of retries if the task fails.
     */
    public async executeWithFallback(task: () => Promise<any>, retries: number = 3): Promise<any> {
        let lastError;
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                return await task();
            } catch (error) {
                lastError = error;
                console.warn(`Attempt ${attempt + 1} failed: ${error.message}`);
            }
        }
        throw new Error(`All attempts failed: ${lastError.message}`);
    }

    /**
     * Add a message to the conversation history.
     * @param message The message to add.
     */
    private addToHistory(message: string): void {
        this.conversationHistory.push(message);
    }

    /**
     * Get the conversation history.
     */
    public getConversationHistory(): string[] {
        return this.conversationHistory;
    }

    /**
     * Provider fallback chain logic would go here.
     */
    public providerFallbackChain() {
        // Implement the fallback chain.
    }
}

export default BaseAgent;