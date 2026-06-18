import { Component, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class AdminErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center gap-4 p-8">
          <AlertTriangle className="h-12 w-12 text-destructive" />
          <h2 className="text-lg font-bold">حدث خطأ غير متوقع</h2>
          <p className="text-sm text-muted-foreground max-w-md">
            {this.state.error?.message || "يرجى المحاولة مرة أخرى"}
          </p>
          <Button variant="outline" onClick={() => this.setState({ hasError: false })}>
            <RefreshCw className="h-4 w-4 ml-2" />
            إعادة المحاولة
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
