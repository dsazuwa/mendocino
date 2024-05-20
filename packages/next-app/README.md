<div align="center"> 
    <h1 align="center">Food Delivery Website</h1>
    <img src="https://github.com/dsazuwa/mendocino/assets/89839770/9f1b8d2a-2ebe-495e-8ad6-1af76524351e" />
</div>

## Tech Stack
- TypeScript
- React.js
- Next.js 14 with App Router
- Tailwind CSS and Shadcn-ui
- Redux RTK query
- Google Maps JavaScript API Loader

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

| Route | Desktop View | Mobile View |
|--|------------|--|
| /home (with no address) | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/035a6241-4392-415b-bb70-ea9056b57174" /> | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/8c878b58-ffd2-41db-aaa9-58c0d8445c38" /> |
| /home (with address) | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/c40a7e76-cdf6-455c-9d08-e7332bd39374" /> | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/38fd622e-c721-4759-a0e2-505759ca80a9" /> |
| /menu | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/5398a3d0-e013-4678-a531-98ababce0295" /> | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/fa35c004-116a-4ea7-aef8-024286d0d9a8" /> |
| /locations/[name]| <img src="https://github.com/dsazuwa/mendocino/assets/89839770/9009bec7-02e7-409f-bc09-ad3969edfac6" /> | <img src="https://github.com/dsazuwa/antarctic-explorer-app/assets/89839770/f533af0e-564a-49d3-a0d2-28e67e81d032" /> |
| /account/profile| <img src="https://github.com/dsazuwa/mendocino/assets/89839770/3ee828af-b85b-403d-b4bf-2d43fc4ea6da" /> | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/1b319432-6b68-45ab-b605-89d49ca5c725" /> |
| /account/addresses | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/4588f751-d8d5-43b7-b89f-6c085ce69ec4" /> | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/8318c567-ee20-4d47-ab55-d7ff8c951a46" /> |
| /account/password | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/27f5411d-323e-4b35-918d-f4fa45f6c854" /> | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/91273e03-4f39-4434-a2b3-27342bec0fc5" /> |
| /account/manage | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/7db98574-aa19-4855-98fb-72def0290f97" /> | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/c720b19f-b795-4500-9596-d3fdcb3e0fcb" /> |
| /register | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/f627fba0-24ff-4773-833b-ac18a133c1bd" /> | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/ccea4a67-f7aa-412f-8aba-f7e05f1c4399" /> |
| /login | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/8da45823-e4ee-4899-adc7-a8c64fc8a303" /> | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/52ad7671-3d2a-427d-88ab-7a36ceb63642" /> |
| /recover (1) | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/f5c6c8bc-2160-4ef6-8514-745ca808546f" /> | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/40fd143d-a3f6-4d0f-9a96-2ad5fd87483d" /> |
| /recover (2) | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/e66109c3-9059-4ceb-8f69-0cbc1c352510" /> | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/8200f35d-3944-4dca-a1be-f13f449b6207" /> |
| /recover (3) | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/079cb995-b594-4532-a504-fe372fa3dabd" /> | <img src="https://github.com/dsazuwa/mendocino/assets/89839770/a4f66fd6-175d-4044-8065-f42f7157614c" /> |
