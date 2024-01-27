import type { CustomClient } from "../index.js";

export default {
    id: "", // button custom id here
    permissions: [],
    roleRequired: "",
    function: async function ({ client , button }: {client:CustomClient , button: any }) {
        button.reply("test");
    },
} as any;
