import React from 'react';

type Props = React.PropsWithChildren<{ 
  className?: string;
  id?: string;
}>;

export default function Section({ children, className = "", id }: Props) {
  return (
    <section id={id} className={`py-16 md:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {children}
      </div>
    </section>
  );
}

