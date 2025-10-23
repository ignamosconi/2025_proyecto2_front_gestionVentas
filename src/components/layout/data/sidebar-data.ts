import {
  LayoutDashboard,
  ListTodo,
  Users,
  Command,
  Tag,
  Building,
  ShoppingBag,
} from 'lucide-react'
import { type SidebarData } from '../types'

export const sidebarData: SidebarData = {
  user: {
    name: 'satnaing',
    email: 'satnaingdev@gmail.com',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'Shadcn Admin',
      logo: Command,
      plan: 'Vite + ShadcnUI',
    },
  ],
  navGroups: [
    {
      title: 'General',
      items: [
        {
          title: 'Dashboard',
          url: '/',
          icon: LayoutDashboard,
        },
        {
          title: 'Usuarios',
          url: '/users',
          icon: Users,
        },
        {
          title: 'Tasks',
          url: '/tasks',
          icon: ListTodo,
        }
      ],
    },
    {
      title: 'Catalogo',
      items: [
        {
          title: 'Líneas de producto',
          url: '/lines',
          icon: ListTodo,
        },
        {
          title: 'Marcas',
          url: '/brands',
          icon: Tag,
        },
        {
          title: 'Proveedores',
          url: '/suppliers',
          icon: Building,
        },
        {
          title: 'Productos',
          url: '/products',
          icon: ShoppingBag,
        }
      ]
    }
  ],
}
