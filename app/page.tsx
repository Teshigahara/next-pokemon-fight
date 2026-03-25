import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      {/* タイトル */}
      <h1 className="text-4xl font-extrabold mb-10 tracking-tight">
        Next Pokemon App
      </h1>
      {/* ボタンエリア */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {/* 対戦ボタン */}
        <Link
          href="/fight"
          className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-md hover:bg-blue-700 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          ⚔️ 対戦する
        </Link>
        {/* 図鑑ボタン */}
        <Link
          href="/encyclopedia"
          className="inline-block px-8 py-4 bg-slate-800 text-white font-bold rounded-xl shadow-md hover:bg-slate-950 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          📖 図鑑を見る
        </Link>
      </div>
    </div>
  );
}
