import { Command } from "../../Command";
import crypto from "crypto";

// Possible answers
const answers = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes, definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Reply hazy, try again",
    "Ask again later",
    "Better not tell you now",
    "Cannot predict now",
    "Concentrate and ask again",
    `Don't count on it`,
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful"
];

export const magic8ball = new Command(
	"magic8ball",
	["magic8ball", "8ball", "8"],
	"magic8ball bozo",
	"magic8ball <question>",
	(msg, agent) => {
        /**
         * Magic 8 ball command
         * 
         * Returns a unique answer for every question asked.
         */

        // Check arguments
        // We're not checking for question marks since the user might think that's too much work
        if (!msg.argv[1]) return `🎱 Ask me a question, dummy`;

        // Hash the question (the user will get the same response for repeated questions)
        // We use a predictable but unique salt (security by obscurity?)
        const hash = crypto.createHash("sha-256");
        hash.update("magic" + msg.argv[1] + "8ball");

        // Use the question hash as the index
        const hex = hash.digest("hex");
        let index = parseInt(hex[0] + hex[1] + hex[2], 16);

        // Make sure the index is within the bounds of the answers array
        while (index >= answers.length) {
            index -= answers.length;
        }

        while (index <= 0) {
            index += answers.length;
        }

        // Answer the user's question
        let answer = answers[index];
        return `🎱 ${answer}, ${msg.p.name}`;
	}
);
