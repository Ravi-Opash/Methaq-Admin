import { WithoutAuthGuard } from "src/guards/without-auth-guard";

export const withoutAuthGuardHOC = (Component) => (props) =>
  (
    <WithoutAuthGuard>
      <Component {...props} />
    </WithoutAuthGuard>
  );
