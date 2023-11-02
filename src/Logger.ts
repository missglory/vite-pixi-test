import { Logger, IMeta } from 'tslog';

export const logger = new Logger({
  // type: "pretty",
	hideLogPositionForProduction: true,
	// name: "testLog",
  prettyLogTemplate: "{{hh}}:{{MM}}:{{ss}}:{{ms}} {{logLevelName}} {{fileNameWithLine}}",
  // overwrite: {
  //   addPlaceholders: (logObjMeta: IMeta, placeholderValues: Record<string, string>) => {
  //     placeholderValues["custom"] = "test";
  //   },
  // },
});