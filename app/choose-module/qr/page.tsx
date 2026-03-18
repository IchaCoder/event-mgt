'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const CHOOSE_MODULE_PATH = '/choose-module';

export default function ChooseModuleQrPage() {
  const [targetUrl, setTargetUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setTargetUrl(`${window.location.origin}${CHOOSE_MODULE_PATH}`);
  }, []);

  const qrCodeUrl = useMemo(() => {
    if (!targetUrl) return '';
    return `https://api.qrserver.com/v1/create-qr-code/?size=420x420&data=${encodeURIComponent(targetUrl)}`;
  }, [targetUrl]);

  const copyLink = async () => {
    if (!targetUrl) return;

    try {
      await navigator.clipboard.writeText(targetUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-xl p-6 md:p-8 border-primary/20 bg-card">
        <div className="space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">Module Selection QR Code</h1>
            <p className="text-muted-foreground">
              Scan this QR code to open the module selection page and view event results.
            </p>
          </div>

          <div className="mx-auto w-70 h-70 md:w-85 md:h-85 rounded-xl border border-border bg-background flex items-center justify-center overflow-hidden">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="QR code linking to module selection page" className="w-full h-full" />
            ) : (
              <div className="w-full h-full animate-pulse bg-muted" aria-hidden="true" />
            )}
          </div>

          <p className="text-sm text-muted-foreground break-all">{targetUrl || 'Preparing link...'}</p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1" size="lg">
              <Link href={CHOOSE_MODULE_PATH}>Open Module Selection</Link>
            </Button>
            <Button type="button" variant="secondary" className="flex-1" size="lg" onClick={copyLink}>
              {copied ? 'Copied' : 'Copy Link'}
            </Button>
          </div>
        </div>
      </Card>
    </main>
  );
}
