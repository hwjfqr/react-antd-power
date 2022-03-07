import { ReactNode } from 'react';
import { PageHeaderProps } from 'antd/es/page-header';
import { PageHeader } from 'antd';
// import { Link } from 'umi';

type RouteType = {
  path: string;
  breadcrumbName: string;
};
function itemRender(route: RouteType, _: unknown, routes: RouteType[]) {
  // const last = routes.indexOf(route) === routes.length - 1;
  const {
    //  path,
    breadcrumbName: name,
  } = route;
  return <span>{name}</span>;
  // return last ? (
  //   <span>{name}</span>
  // ) : (
  //   <Link to={path}>{route.breadcrumbName}</Link>
  // );
}

interface BreadHeaderPropType extends PageHeaderProps {
  title: string | ReactNode;
  routes?: RouteType[];
  children?: ReactNode;
  [prop: string]: unknown;
}
function BreadHeader({
  title,
  routes,
  children,
  ...pageHeaderRest
}: BreadHeaderPropType) {
  return (
    <PageHeader
      ghost={false}
      title={title}
      breadcrumb={{
        itemRender,
        routes,
      }}
      {...pageHeaderRest}
    >
      {children}
    </PageHeader>
  );
}

export default BreadHeader;
