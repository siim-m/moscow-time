variable "container_image_tag" {
  type = string
}

variable "twitter_api_key" {
  type      = string
  sensitive = true
}

variable "twitter_api_key_secret" {
  type      = string
  sensitive = true
}

variable "twitter_oauth_token" {
  type      = string
  sensitive = true
}

variable "twitter_oauth_token_secret" {
  type      = string
  sensitive = true
}

variable "users_to_follow" {
  type = string
}
