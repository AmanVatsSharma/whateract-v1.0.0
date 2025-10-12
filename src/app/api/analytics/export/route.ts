import { NextResponse } from "next/server";

export async function GET() {
  const rows = [
    ["Campaign","Sent","Delivered","Read","Responded","Conversion"],
    ["Campaign A","1000","980","750","200","15"],
    ["Campaign B","1500","1450","1200","350","20"],
    ["Campaign C","800","790","600","150","12"],
    ["Campaign D","2000","1950","1600","500","18"],
  ];
  const csv = rows.map(r => r.join(",")).join("\n");
  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": "attachment; filename=analytics.csv",
    },
  });
}
