locals {
  tags = {
    workload = "Moscow Time Twitter Bot"
  }
}

# resource "azurerm_resource_group" "this" {
#   name     = "moscow-time-twitter-bot"
#   location = "westus"
#   tags     = local.tags
# }

# resource "azurerm_log_analytics_workspace" "this" {
#   name                = "moscow-time-twitter-bot-law"
#   resource_group_name = azurerm_resource_group.this.name
#   location            = azurerm_resource_group.this.location
#   sku                 = "PerGB2018"
#   retention_in_days   = 30
#   daily_quota_gb      = -1
#   tags                = local.tags
# }

# resource "azapi_resource" "container_apps_environment" {
#   type      = "Microsoft.App/managedEnvironments@2022-03-01"
#   name      = "moscowtime-twitter-bot-cae"
#   parent_id = azurerm_resource_group.this.id
#   location  = azurerm_resource_group.this.location
#   tags      = local.tags

#   body = jsonencode({
#     properties = {
#       appLogsConfiguration = {
#         destination = "log-analytics"

#         logAnalyticsConfiguration = {
#           customerId = azurerm_log_analytics_workspace.this.workspace_id
#           sharedKey  = azurerm_log_analytics_workspace.this.primary_shared_key
#         }
#       }
#     }
#   })
# }

# resource "azapi_resource" "container_app" {
#   type      = "Microsoft.App/containerApps@2022-03-01"
#   name      = "moscow-time-twitter-bot-ca"
#   parent_id = azurerm_resource_group.this.id
#   location  = azurerm_resource_group.this.location
#   tags      = local.tags

#   body = jsonencode({
#     properties = {
#       managedEnvironmentId = azapi_resource.container_apps_environment.id

#       configuration = {
#         secrets = [
#           {
#             name  = "twitter-api-key"
#             value = var.twitter_api_key
#           },
#           {
#             name  = "twitter-api-key-secret"
#             value = var.twitter_api_key_secret
#           },
#           {
#             name  = "twitter-oauth-token"
#             value = var.twitter_oauth_token
#           },
#           {
#             name  = "twitter-oauth-token-secret"
#             value = var.twitter_oauth_token_secret
#           },
#         ]
#       }

#       template = {
#         containers = [
#           for container_exec_file in ["scheduled"] :

#           {
#             image   = "ghcr.io/siim-m/moscow-time-twitter-bot:${var.container_image_tag}"
#             name    = "moscow-time-twitter-bot-${container_exec_file}"
#             command = ["node", container_exec_file]

#             env = [
#               {
#                 name      = "TWITTER_API_KEY"
#                 secretRef = "twitter-api-key"
#               },
#               {
#                 name      = "TWITTER_API_KEY_SECRET"
#                 secretRef = "twitter-api-key-secret"
#               },
#               {
#                 name      = "TWITTER_OAUTH_TOKEN"
#                 secretRef = "twitter-oauth-token"
#               },
#               {
#                 name      = "TWITTER_OAUTH_TOKEN_SECRET"
#                 secretRef = "twitter-oauth-token-secret"
#               },
#               {
#                 name  = "USERS_TO_FOLLOW"
#                 value = var.users_to_follow
#               },
#               {
#                 name  = "NODE_OPTIONS"
#                 value = "--max-old-space-size=20"
#               },
#             ]

#             resources = {
#               cpu    = 0.25,
#               memory = "0.5Gi",
#             },
#           }
#         ]

#         scale = {
#           minReplicas = 1
#           maxReplicas = 1
#         }
#       }
#     }
#   })
# }
