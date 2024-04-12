export default function TagBar() {
  const tags = [
    { name: 'V', description: 'Vegan' },
    { name: 'VG', description: 'Vegetarian' },
    { name: 'GF', description: 'Gluten-Free' },
    { name: 'RGF', description: 'Can be Requested Gluten-Free' },
    { name: 'N', description: 'Contains Nuts' },
  ];

  return (
    <div className='flex flex-row flex-wrap justify-center gap-2 md:gap-4'>
      {tags.map(({ name, description }, index) => (
        <div key={`tag-${index}`} className='flex flex-row gap-1 md:gap-2'>
          <span className='text-[10px] font-medium text-primary-900 md:text-xs'>
            {name}
          </span>

          <div className='h-full w-[1px] bg-neutral-300' />

          <span className='text-[10px] font-medium text-neutral-400 md:text-xs'>
            {description}
          </span>
        </div>
      ))}
    </div>
  );
}
