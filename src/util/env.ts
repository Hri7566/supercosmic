import z from "zod";
import { createEnv } from "@t3-oss/env-core";

export const env = createEnv({
	isServer: true,
	server: {
		MPPNET_TOKEN: z.string()
	},
	runtimeEnv: process.env
});

export default env;
