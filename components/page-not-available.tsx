import React from 'react';
import { Card } from './ui/card';
import Link from 'next/link';
import { Button } from './ui/button';

type Props = {};

const PageUnavailable = (props: Props) => {
  return (
    <Card className="border-primary/30 bg-linear-to-br from-primary/10 via-card to-amber-50/40 p-10 text-center">
      <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Matured Classes Module</p>
      <h1 className="mt-3 text-4xl font-black text-foreground">Dashboard Under Construction</h1>
      <p className="mt-3 text-muted-foreground">This page is not available.</p>

      <div className="mt-8 flex justify-center">
        <Link href="/">
          <Button size="lg">Return Home</Button>
        </Link>
      </div>
    </Card>
  );
};

export default PageUnavailable;
