export interface Address {
  id: string;
  title: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  isDefault: boolean;
}

export async function getAddresses(): Promise<Address[]> {
  return [
    {
      id: "addr1",
      title: "خانه",
      province: "تهران",
      city: "تهران",
      address: "خیابان ولیعصر، بالاتر از پارک وی، کوچه نسترن، پلاک ۱۲، واحد ۳",
      postalCode: "1234567890",
      isDefault: true,
    },
    {
      id: "addr2",
      title: "محل کار",
      province: "تهران",
      city: "تهران",
      address: "سعادت‌آباد، بلوار دریا، خیابان مطهری، پلاک ۴۵، طبقه ۲",
      postalCode: "0987654321",
      isDefault: false,
    },
  ];
}

export async function removeAddress(id: string): Promise<void> {
  console.log(`حذف آدرس ${id}`);
}

export async function setDefaultAddress(id: string): Promise<void> {
  console.log(`آدرس ${id} به عنوان پیش‌فرض تنظیم شد`);
}