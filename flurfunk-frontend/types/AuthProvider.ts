import React from 'react'

export interface AuthProvider {
  name: string
  driver: string
  icon: string
}

export interface AuthProviderResponse {
  disableDefault: false
  data: Array<AuthProvider>
}

export interface AuthProviderInfo {
  icon: React.ReactNode
  name: string
}

export interface AuthProviderInfoMap {
  [authProviderIcon: string]: AuthProviderInfo
}
