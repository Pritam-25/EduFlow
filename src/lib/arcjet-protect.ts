import { aj, fixedWindow } from "@/lib/arcjet";

export const ajProtect = aj
    .withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 10 }));