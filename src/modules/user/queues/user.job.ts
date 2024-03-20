import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import amqp, { ChannelWrapper } from 'amqp-connection-manager';
import { Channel } from 'amqplib';

@Injectable()
export class UserJob {
  private channelWrapper: ChannelWrapper;

  constructor(private readonly configService: ConfigService) {
    this.setupAmqpConnection();
  }

  private setupAmqpConnection() {
    const connection = amqp.connect([
      `${this.configService.get('queue.amqp.uri')}`,
    ]);
    this.channelWrapper = connection.createChannel({
      setup: (channel: Channel) => {
        return channel.assertQueue('emailQueue', { durable: true });
      },
    });
  }

  public async addToEmailQueue(mail: any) {
    try {
      await this.sendMailToQueue(mail);
      Logger.log('Sent To Queue');
    } catch (error) {
      throw new HttpException(
        'Error adding mail to queue',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async sendMailToQueue(mail: any) {
    await this.channelWrapper.sendToQueue(
      'emailQueue',
      Buffer.from(JSON.stringify(mail)),
      {
        persistent: true,
      },
    );
  }
}
