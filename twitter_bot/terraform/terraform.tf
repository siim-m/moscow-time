terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    azapi = {
      source  = "azure/azapi"
      version = "~> 0.2"
    }
  }

  cloud {
    organization = "siim"

    workspaces {
      name = "moscow-time"
    }
  }
}

provider "azurerm" {
  features {}
}
