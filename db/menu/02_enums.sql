CREATE TYPE menu.enum_discount_unit AS ENUM ('percentage', 'amount');
CREATE TYPE menu.enum_menu_status AS ENUM ('active', 'coming soon', 'inactive');
CREATE TYPE menu.enum_order_status AS ENUM ('available', 'unavailable for today', 'unavailable indefinitely');
CREATE TYPE menu.enum_modifier_status AS ENUM ('available', 'unavailable for today', 'unavailable indefinitely');