import {
  DiscordArgumentMetadata,
  DiscordPipeTransform,
  ReflectMetadataProvider,
} from '@discord-nestjs/core';
import { Injectable } from '@nestjs/common';
import { CommandInteraction } from 'discord.js';

@Injectable()
export class TransformPipe implements DiscordPipeTransform {
  constructor(private readonly metadataProvider: ReflectMetadataProvider) {}

  transform(
    interaction: CommandInteraction,
    metadata: DiscordArgumentMetadata<'interactionCreate'>,
  ): any {
    if (!metadata.metatype || !interaction) {
      return;
    }

    const { dtoInstance } = metadata.commandNode;

    Object.keys(dtoInstance).map((property: string) => {
      const argDecoratorOptions = this.metadataProvider.getArgDecoratorMetadata(
        dtoInstance,
        property,
      );
      dtoInstance[property] = interaction.options.get(
        argDecoratorOptions.name,
        argDecoratorOptions.required,
      ).value;
    });

    return dtoInstance;
  }
}
