import logger from "pino";
import dayjs from "dayjs";
import pinoPretty from "pino-pretty";

export const Log = logger(
  {
    base: { pid: false },
    timestamp: () => `,"time":"${dayjs().format("YYYY-MM-DDTHH:mm:ssZ[Z]")}"`,
  },
  pinoPretty({
    colorize: true,
  })
);
