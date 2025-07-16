
import { aj, detectBot, fixedWindow } from "@/lib/arcjet";

export const ajProtect = aj
    .withRule(
        detectBot({ mode: "LIVE", allow: [] }) // no bots allowed for course creation
    )
    .withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 5 }));