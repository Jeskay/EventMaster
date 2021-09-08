import { Collection, CommandInteraction, Message, MessageActionRow, MessageEmbed, TextBasedChannels } from "discord.js";

export class List {
    private readonly lifetime: number;
    private readonly content: MessageEmbed;
    private readonly fields: number;
    private readonly limit: number;
    private message_page: Collection<string, number>;

    private async updateEmbed(messageId?: string) {
        const page: number = messageId ? this.message_page[messageId] : 1;
        if(isNaN(page))
            throw Error("Message is not tracking anymore.");
        const newContent = Object.create(this.content) as MessageEmbed;
        const startingIndex = (page - 1) * this.fields;
        newContent.fields = newContent.fields.slice(startingIndex, startingIndex + this.fields);
        newContent.setFooter(`${page}/${this.limit}`);
        return newContent;
    }
    /** Creates a list instance for new message.
     * Also starts a countdown until message clearing
     */
    public async create(channel: TextBasedChannels | CommandInteraction, attachments: MessageActionRow) {
        const embed = await this.updateEmbed();
        let message: Message;
        if(channel instanceof CommandInteraction)
            message = await channel.reply({embeds: [embed], components: [attachments], ephemeral: true, fetchReply: true}) as Message;
        else message = await channel.send({embeds: [embed], components: [attachments]});
        this.message_page[message.id] = 1;
        setTimeout(() => message.delete(), this.lifetime * 1000);
    }
    /** Updates message to the next page */
    public async next(messageId: string) {
        if(this.message_page[messageId] == this.limit) throw Error("Page limit reached");
        this.message_page[messageId]++;
        return await this.updateEmbed(messageId);
    }
    /**Updates message to the previous page */
    public async previous(messageId: string) {
        if(this.message_page[messageId] == 1) throw Error("Page limit reached");
        this.message_page[messageId]--;
        return await this.updateEmbed(messageId);
    }
    /**
     * @param lifetime time in seconds after which message will be cleared
     * @param content the content to display
     * @param fieldsView amount of fields, displayed on the single page
     */
    constructor(lifetime: number, content: MessageEmbed, fieldsView: number) {
        this.lifetime = lifetime;
        this.content = content;
        this.fields = fieldsView < 25 ? fieldsView : 25;
        this.message_page = new Collection();
        this.limit = Math.ceil(content.fields.length / this.fields);
    }
}