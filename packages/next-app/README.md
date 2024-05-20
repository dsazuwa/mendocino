This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started
1. Clone the repo
    ```bash
    git clone https://github.com/dsazuwa/mendocino
    ```
    
2. Go to the project folder
    ```bash
    cd packages/next-app
    ```
    
3. Set up your .env file
    - Duplicate the `.env.sample` to `.env`
    - Fill in the missing variables
    - Follow the instructions at Google Maps API documentation to create a [Map ID](https://developers.google.com/maps/documentation/get-map-id) and a [Places API Key](https://developers.google.com/maps/documentation/javascript/get-api-key)
      
4. Install dependencies
    ```bash
    npm install
    ```
    
5. Run the development server
   ```bash
    npm run dev
    ```
6. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Project Structure
```
    next-app/
    ├── app/
    │   ├── (auth)/                      # Authentication related routes
    │   │   ├── verify/
    │   │   ├── login/
    │   │   ├── recover/
    │   │   ├── register/
    │   │   └── layout.tsx
    │   ├── (client)/                    # Client specific routes
    │   │   ├── account/
    │   │   │   ├── (main)/
    │   │   │   │   ├── addresses/
    │   │   │   │   ├── profile/
    │   │   │   │   └── layout.tsx
    │   │   │   ├── manage/
    │   │   │   ├── password/
    │   │   │   ├── page.tsx
    │   │   │   └── layout.tsx
    │   │   ├── locations/               # Store front page e.g. /locations/West%20Village
    │   │   │   └── [name]/
    │   │   │       └── page.tsx
    │   │   ├── menu/                    # Public menu
    │   │   ├── page.tsx                 # Home
    │   │   └── layout.tsx
    │   ├── actions/                     # Server side actions
    │   ├── providers/                   # Context providers eg. redux, tanstack-query, zustand, context, etc.
    │   └──layout.tsx
    ├── components/
    │   ├── address/
    │   ├── cart/
    │   ├── home/
    │   ├── icons/
    │   ├── layout/
    │   ├── mui-tabs/                    # MUI Tab component adjusted to work with Next.js + Tailwind
    │   ├── ...
    │   └── ui/                          # Shadcn-ui components
    ├── hooks/
    ├── lib/
    │   ├── auth.utils.ts                # Authentication specific utility functions
    │   ├── data.ts                      # Server side data fetching function
    │   └── utils.ts
    ├── redux
    │   ├── api/
    │   ├── slices/
    │   │   └── order/                   # reducers for managing menu item and modifier state in locations/[name]
    │   ├── base-query.ts                # handles refreshing access token and retrying request in event of a 401 error
    │   ├── hooks.ts
    │   └── index.ts
    ├── types/
    └── middleware.ts                   # handles JWT cookies rotation and route protection


```
