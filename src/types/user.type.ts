type Role = 'User' | 'Admin'

export interface User {
  roles: Role[]
  _id: string
  email: string
  createdAt: string
  updatedAt: string
  name?: string
  date_of_birth?: string // ISO 8610
  avatar?: string
  address?: string
  phone?: string
}
