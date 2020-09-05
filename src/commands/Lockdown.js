module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("lockdown", ...arguments);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const [ targetChannel = channel.toString() ] = args;

		// Make sure sender is a bot master
		if(sender._roles.some(role => guildConfig.botmasters.includes(role)) || sender.permissions.has("MANAGE_CHANNELS")) {

			const target = guild.channels.resolve(targetChannel.replace(/[\\<>@#&!]/g, ""));
			if(target.permissionsFor(guild.roles.everyone).has("SEND_MESSAGES")) {
				target.overwritePermissions([{ id: guild.roles.everyone, deny: ["SEND_MESSAGES"] }])
				channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Channel ${target.toString()} is now locked down (read only).`));
			} else {
				target.overwritePermissions([{ id: guild.roles.everyone, allow: ["SEND_MESSAGES"] }])
				channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.success)
				.setDescription(`Channel ${target.toString()} is no longer locked down (read only).`));
			}

		} else {
			channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`));
		}

	}

}
