import { ArrowRight, Layers, Link2, Star } from "lucide-react";
import Link from "next/link";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    href: "/sites",
    icon: Layers,
    title: "사이트 관리",
    description: "URL 템플릿을 이름 기반으로 생성하고 관리합니다",
  },
  {
    href: "/builder",
    icon: Link2,
    title: "URL 빌더",
    description: "구성요소를 선택해 URL을 빌드하고 열거나 복사합니다",
  },
  {
    href: "/presets",
    icon: Star,
    title: "프리셋",
    description: "자주 사용하는 조합을 저장하고 즐겨찾기로 빠르게 접근합니다",
  },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      {/* 히어로 */}
      <section className="space-y-3 pt-4">
        <h1 className="text-3xl font-bold tracking-tight">URL Kit</h1>
        <p className="text-lg text-muted-foreground">
          URL 구성요소를 관리하고 조합하는 도구. 서브도메인, 경로, 쿼리를 이름 기반으로 관리하세요.
        </p>
      </section>

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

      {/* 즐겨찾기 영역 — 나중에 구현 */}
      <section className="space-y-3">
        <h2 className="text-xl font-semibold">즐겨찾기</h2>
        <p className="text-sm text-muted-foreground">
          프리셋을 즐겨찾기에 추가하면 여기에서 바로 URL을 열 수 있습니다.
        </p>
      </section>
    </div>
  );
}
