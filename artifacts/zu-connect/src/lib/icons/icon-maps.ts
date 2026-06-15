import {
  Globe, AlertTriangle, GraduationCap, Calendar, CheckCircle,
  Settings, HeartPulse, FlaskConical, Scale, BarChart, Monitor, Atom, BookOpen, Radio, Sprout, Wrench,
  FileText, Book, Search, Headphones,
  Star, BarChart3, Trophy,
  Languages, Code, Brain, Beaker, Megaphone,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

type IconMap<T extends string> = Record<T, { icon: LucideIcon; label: string }>

export const newsCategoryIcons: IconMap<string> = {
  "أخبار": { icon: Globe, label: "أخبار" },
  "عاجل": { icon: AlertTriangle, label: "عاجل" },
  "دورات": { icon: GraduationCap, label: "دورات" },
  "فعاليات": { icon: Calendar, label: "فعاليات" },
  "أنشطة منجزة": { icon: CheckCircle, label: "أنشطة منجزة" },
  "أخبار الكليات": { icon: Globe, label: "أخبار الكليات" },
  "إعلانات عامة": { icon: Megaphone, label: "إعلانات عامة" },
  "أنشطة طلابية": { icon: Calendar, label: "أنشطة طلابية" },
  "منح دراسية": { icon: GraduationCap, label: "منح دراسية" },
}

export const newsCategoryColors: Record<string, string> = {
  "أخبار": "",
  "عاجل": "#E32652",
  "دورات": "#22c55e",
  "فعاليات": "#3b82f6",
  "أنشطة منجزة": "#a855f7",
  "أخبار الكليات": "",
  "إعلانات عامة": "#E32652",
  "أنشطة طلابية": "#3b82f6",
  "منح دراسية": "#22c55e",
}

export const collegeIcons: IconMap<string> = {
  "كلية الهندسة والتقنية": { icon: Settings, label: "هندسة وتقنية" },
  "كلية الطب البشري": { icon: HeartPulse, label: "طب بشري" },
  "كلية الصيدلة": { icon: FlaskConical, label: "صيدلة" },
  "كلية القانون والعلوم السياسية": { icon: Scale, label: "قانون وعلوم سياسية" },
  "كلية الاقتصاد والأعمال": { icon: BarChart, label: "اقتصاد وأعمال" },
  "كلية الحاسوب والمعلوماتية": { icon: Monitor, label: "حاسوب ومعلوماتية" },
  "كلية العلوم الأساسية": { icon: Atom, label: "علوم أساسية" },
  "كلية الآداب والإنسانيات": { icon: BookOpen, label: "آداب وإنسانيات" },
  "كلية التربية": { icon: GraduationCap, label: "تربية" },
  "كلية الإعلام والاتصال": { icon: Radio, label: "إعلام واتصال" },
  "كلية الزراعة": { icon: Sprout, label: "زراعة" },
  "المعهد العالي للتقنية": { icon: Wrench, label: "معهد عالي للتقنية" },
}

export const libraryTypeIcons: IconMap<string> = {
  "ملخصات": { icon: FileText, label: "ملخصات" },
  "كتب PDF": { icon: Book, label: "كتب PDF" },
  "بحوث": { icon: Search, label: "بحوث" },
  "تسجيلات": { icon: Headphones, label: "تسجيلات" },
  "محاضرات مسجلة": { icon: Headphones, label: "محاضرات مسجلة" },
}

export const courseCategoryIcons: IconMap<string> = {
  "لغات": { icon: Languages, label: "لغات" },
  "تقنية": { icon: Code, label: "تقنية" },
  "مهارات شخصية": { icon: Brain, label: "مهارات شخصية" },
  "علمي": { icon: Beaker, label: "علمي" },
}

export const courseLevelIcons: IconMap<string> = {
  "مبتدئ": { icon: Star, label: "مبتدئ" },
  "متوسط": { icon: BarChart3, label: "متوسط" },
  "متقدم": { icon: Trophy, label: "متقدم" },
}

export function getCollegeIcon(name: string) {
  return collegeIcons[name]?.icon ?? GraduationCap
}

export function getLibraryTypeIcon(type: string) {
  return libraryTypeIcons[type]?.icon ?? Book
}

export function getNewsCategoryIcon(category: string) {
  return newsCategoryIcons[category]?.icon ?? Globe
}

export function getNewsCategoryColor(category: string) {
  return newsCategoryColors[category] ?? ""
}

export function getCourseCategoryIcon(category: string) {
  return courseCategoryIcons[category]?.icon ?? GraduationCap
}

export function getCourseLevelIcon(level: string) {
  return courseLevelIcons[level]?.icon ?? Star
}
