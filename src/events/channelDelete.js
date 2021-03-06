module.exports = async function(guild, [ channel ]) {

	// Make sure audit gets sent to right server
	if(channel.guild.id !== guild.id) return;

	// Send audit message
	return await sendAudit(guild, {

		color: "error",
		title: `Channel deleted`,
		fields: [{

			// Left column
			name: "Channel info",
			value: [
				`• Category:`,
				`• ID:`,
				`• Name:`,
				`• Type:`,
			].join("\n"),
			inline: true

		}, {

			// Right column
			name: "\u200b",
			value: [
				`**\`${channel.parent ? channel.parent.name : "none"}\`**`,
				`**\`${channel.id}\`**`,
				`**\`${channel.name}\`**`,
				`**\`${channel.type}\`**`,
			].join("\n"),
			inline: true

		}],

	});

}
