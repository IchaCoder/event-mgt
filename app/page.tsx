'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-12">
        <div className="text-center space-y-4">
          <div>
            <Image src={'/ronsard.png'} alt="Ronsard Logo" width={150} height={80} className="mx-auto" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-foreground">School Sports Event Manager</h1>
          <p className="text-xl text-muted-foreground">Select a module to manage class competitions</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Early Classes Module */}
          <Link href="/early">
            <Card className="h-full p-8 hover:shadow-lg transition-all cursor-pointer border-primary/20 hover:border-primary/50 bg-card">
              <div className="space-y-6 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-linear-to-br from-red-500 to-yellow-500 flex items-center justify-center">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-foreground">Ecole Nursery</h2>
                    <p className="text-muted-foreground">Nursery and KG competition dashboard</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Classes:</p>
                    <ul className="text-foreground space-y-1">
                      <li>• Apple Class</li>
                      <li>• Emerald Green Class</li>
                      <li>• Red Class</li>
                      <li>• Yellow Class</li>
                    </ul>
                  </div>
                  <Button className="w-full mt-4" size="lg">
                    Enter Module
                  </Button>
                </div>
              </div>
            </Card>
          </Link>

          {/* Matured Classes Module */}
          <Link href="/matured/results">
            <Card className="h-full p-8 hover:shadow-lg transition-all cursor-pointer border-primary/20 hover:border-primary/50 bg-card">
              <div className="space-y-6 h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-lg bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold text-foreground">Primary & Secondary</h2>
                    <p className="text-muted-foreground">Primary and Secondary dashboard</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-1 text-sm">
                    <p className="text-muted-foreground">Classes:</p>
                    <ul className="text-foreground space-y-1">
                      <li>• Year 1 to Year 6</li>
                      <li>• Lower Primary</li>
                      <li>• Upper Primary</li>
                      <li>• Secondary Class</li>
                    </ul>
                  </div>
                  <Button className="w-full mt-4" size="lg" variant="secondary">
                    Enter Module
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        </div>
      </div>
    </main>
  );
}
