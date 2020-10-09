module.exports = class Command extends require("../Command.js") {

	constructor() {
		super("mute", ...arguments);
		this.register("Mute a member in this server. 🔇", HelpSection.MODERATION, [{
			argument: "@User",
			required: true,
		}, {
			argument: "Reason",
			required: false,
		}]);
	}

	async onCommand({ args, sender, guildConfig, root, channel, guild, audit }) {

		const [ user = "", duration = null, ...reason ] = args;
		const userid = user.replace(/[\\<>@#&!]/g, "");

		let mutetime = 0;
		if(duration !== null) mutetime = ms(duration);

		// Make sure sender is a bot master
		if(util.hasPermissions(sender, guildConfig, "MANAGE_ROLES")) {

			let muterole;
			if(config[guild.id].commands["mute"].muterole) {
				muterole = config[guild.id].commands["mute"].muterole;
			} else {
				const role = await guild.roles.create({
					data: { name: "Muted (via Josh O' Bot)", color: 0x546e7a },
	  				reason: "Create muted role",
				});
				await role.setPermissions(103875585);
				muterole = role.id;
				config[guild.id].commands.mute.muterole = muterole;
				await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guild.id}.yml`), YAML.stringify(config[guild.id]), "utf8");
			}

			guild.channels.cache.map(channel => channel.permissionsFor(muterole).has("SEND_MESSAGES") && channel.updateOverwrite(muterole, { SEND_MESSAGES: false }));

			if(user !== "") {
				try {
					guild.member(userid).roles.add(muterole).then(async function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.warn)
						.setDescription(`User <@!${userid}> was muted for ${duration === null ? "for an eternity": cms(mutetime)}. ${reason.length === 0 ? "":"Reason: __" + reason.join(" ") + "__."}`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));

						if (duration !== null) {
							config[guild.id].commands.mute.persistance.push({ moderator: sender.id, specimen: userid, expires: Date.now() + mutetime, channel: channel.id });
							await fs.writeFile(path.join(APP_ROOT ,"config", `guild_${guild.id}.yml`), YAML.stringify(config[guild.id]), "utf8");
						}

					}).catch(function() {
						channel.send(new MessageEmbed()
						.setColor(guildConfig.theme.error)
						.setDescription(`User <@!${userid}> can not be muted.`)
						.setFooter(sender.displayName, sender.user.displayAvatarURL()));
					});

				} catch (e) {
					channel.send(new MessageEmbed()
					.setColor(guildConfig.theme.error)
					.setDescription(`<@!${userid}> can not be muted.`)
					.setFooter(sender.displayName, sender.user.displayAvatarURL()));
				}
			} else {
				return channel.send(new MessageEmbed()
				.setColor(guildConfig.theme.warn)
				.setDescription(`Usage:\n\`${root} <@user> [reason]\``)
				.setFooter(sender.displayName, sender.user.displayAvatarURL()));
			}
		} else {
			return channel.send(new MessageEmbed()
			.setColor(guildConfig.theme.error)
			.setDescription(`You my friend, are not a bot master.`)
			.setFooter(sender.displayName, sender.user.displayAvatarURL()));
		}

	}

}
