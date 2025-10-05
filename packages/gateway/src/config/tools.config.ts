


export interface ToolConfig {
  
  type: 'http' | 'local';

  
  location: string;
}


export const toolServerRegistry: { [toolName: string]: ToolConfig } = {
  
  
  "Weather": {
    type: 'local',
    location: 'tools/weather/build/main.js'
  },

  "Context7": {
    type:"http",
    location: "https://mcp.context7.com/mcp"
  }

  
  

  
  
  
};



export const toolPermissions: { [userEmail: string]: string[] } = {
  
  
  "admin@example.com": ["*"],

  
  "test@example.com": ["Weather"],

  
  "trader@example.com": ["stockPrice"],
};