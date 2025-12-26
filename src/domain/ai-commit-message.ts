export class AiCommitMessage {
  readonly type: string;
  readonly description: string;
  readonly body: string[] | undefined;

  private constructor(type: string, description: string, body?: string[]) {
    this.type = type;
    this.description = description;
    this.body = body;
  }

  static create(
    type: string,
    description: string,
    body?: string[],
  ): AiCommitMessage {
    return new AiCommitMessage(type, description, body);
  }
}
