"use client";

import { ArrowRight, Layers, Link2, Plus, Star } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FavoriteList } from "@/features/favorites/components/favorite-list";
import { useSites } from "@/features/sites/hooks/use-sites";

const features = [
  {
    href: "/sites",
    icon: Layers,
    title: "사이트 관리",
    description: "사이트를 생성하고 관리합니다",
  },
  {
    href: "/builder",
    icon: Link2,
    title: "URL 빌더",
    description: "구성요소를 추가하고 선택해 URL을 빌드합니다",
  },
  {
    href: "/presets",
    icon: Star,
    title: "프리셋",
    description: "자주 사용하는 조합을 저장하고 즐겨찾기로 빠르게 접근합니다",
  },
];

export default function HomePage() {
  const { data: sites, isLoading } = useSites();
  const hasSites = !isLoading && sites && sites.length > 0;

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* 히어로 */}
      <section className="space-y-3 pt-4">
        <h1 className="text-3xl font-bold tracking-tight">URL Kit</h1>
        <p className="text-lg text-muted-foreground">
          URL 구성요소를 관리하고 조합하는 도구. 프로토콜, 서브도메인, 도메인,
          경로, 쿼리를 자유롭게 구성하세요.
        </p>
      </section>

      {!isLoading && !hasSites ? (
        /* 온보딩 */
        <section>
          <Card className="flex flex-col items-center gap-6 px-8 py-16 text-center">
            <CardHeader className="w-full items-center p-0">
              <CardTitle className="text-xl">
                환영합니다! 첫 사이트를 추가해 보세요
              </CardTitle>
              <CardDescription>
                사이트를 추가하면 URL 구성요소를 관리하고 조합할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <Button asChild>
              <Link href="/sites/new">
                <Plus className="mr-2 h-4 w-4" />
                첫 사이트 추가하기
              </Link>
            </Button>
          </Card>
        </section>
      ) : (
        <>
          {/* 기능 카드 */}
          <section className="grid gap-4 sm:grid-cols-3">
            {features.map(({ href, icon: Icon, title, description }) => (
              <Link key={href} href={href}>
                <Card className="group h-full transition-colors hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-primary" />
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                    </div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </section>

          {/* 즐겨찾기 */}
          <section className="space-y-3">
            <h2 className="flex items-center gap-2 text-xl font-semibold">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              즐겨찾기
            </h2>
            <FavoriteList />
          </section>
        </>
      )}
    </div>
  );
}
