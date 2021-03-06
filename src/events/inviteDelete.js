module.exports = async function(guild, [ invite ]) {

	// Make sure audit gets sent to right server
	if(invite.guild.id !== guild.id) return;

	// Send audit message
	return await sendAudit(guild, {

		color: "error",
		title: `Invite deleted`,
		desc: invite,
		fields: [{

			// Left column
			name: "Invite info",
			value: [
				`• Channel:`,
				`• Code:`,
			].join("\n"),
			inline: true

		}, {

			// Right column
			name: "\u200b",
			value: [
				`${invite.channel}`,
				`**\`${invite.code}\`**`,
			].join("\n"),
			inline: true

		}],

	});

}
