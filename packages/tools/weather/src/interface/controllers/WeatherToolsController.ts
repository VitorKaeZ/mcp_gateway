import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { WeatherService } from "../../application/services/WeatherService.js";

export class WeatherToolsController {
  constructor(
    private server: McpServer,
    private weatherService: WeatherService
  ) {
    this.registerTools();
  }

  private registerTools(): void {
    this.registerGetAlertsToolhandler();
    this.registerGetForecastToolHandler();
  }

  private registerGetAlertsToolhandler(): void {
    this.server.registerTool(
      "get-alerts",
      {
        title: "Get Alerts",
        description:"Get weather alerts for a state",
        inputSchema: {
        state: z
          .string()
          .length(2)
          .describe("Two-letter state code (e.g. CA, NY)"),
        },
        annotations: {
          category: "weather",
          icon: "🌤️",
        },
      },
      async ({ state }) => {
        const alertsText = await this.weatherService.getAlertsForState(state);

        return {
          content: [
            {
              type: "text",
              text: alertsText,
            },
          ],
        };
      }
    );
  }

  private registerGetForecastToolHandler(): void {
    this.server.registerTool(
      "get-forecast",
      
      {
        title: "Get Forecast",
        description: "Get weather forecast for a location",
        inputSchema: {
          latitude: z
            .number()
            .min(-90)
            .max(90)
            .describe("Latitude of the location"),
          longitude: z
            .number()
            .min(-180)
            .max(180)
            .describe("Longitude of the location"),
        },
        annotations: {
          category: "weather",
          icon: "🌤️",
        },
      },   
      async ({ latitude, longitude }) => {
        const forecastText = await this.weatherService.getForecastForLocation(
          latitude,
          longitude
        );

        return {
          content: [
            {
              type: "text",
              text: forecastText,
            },
          ],
        };
      }
    );
  }
}