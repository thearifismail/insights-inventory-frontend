import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, useStore, shallowEqual, useSelector } from 'react-redux';
import './inventory.scss';
import '@redhat-cloud-services/frontend-components-inventory-patchman/dist/cjs/index.css';
import { Link } from 'react-router-dom';
import { entitesDetailReducer, addNewListener } from '../store';
import * as actions from '../actions';
import { Grid, GridItem } from '@patternfly/react-core';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
import routerParams from '@redhat-cloud-services/frontend-components-utilities/files/RouterParams';
import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/files/Registry';
import { Skeleton, SkeletonSize, PageHeader, Main } from '@redhat-cloud-services/frontend-components';
import '@redhat-cloud-services/frontend-components-inventory-general-info/index.css';
import '@redhat-cloud-services/frontend-components-inventory-insights/index.css';
import '@redhat-cloud-services/frontend-components-inventory-vulnerabilities/dist/cjs/index.css';
import { SystemCvesStore } from '@redhat-cloud-services/frontend-components-inventory-vulnerabilities/dist/cjs/SystemCvesStore';
import {
    SystemAdvisoryListStore,
    SystemPackageListStore
} from '@redhat-cloud-services/frontend-components-inventory-patchman/dist/esm';
import classnames from 'classnames';
import { routes } from '../Routes';

import { ScalprumComponent } from '@scalprum/react-core';
import { useHistory } from 'react-router-dom';

const Inventory = ({ entity, currentApp, clearNotifications, loadEntity }) => {
    const store = useStore();
    const history = useHistory();
    const { loading, writePermissions } = useSelector(
        ({ permissionsReducer }) =>
            ({ loading: permissionsReducer?.loading, writePermissions: permissionsReducer?.writePermissions }),
        shallowEqual
    );

    useEffect(() => {
        clearNotifications();
        insights.chrome?.hideGlobalFilter?.(true);
        insights.chrome.appAction('system-detail');
    }, []);

    const additionalClasses = {
        'ins-c-inventory__detail--general-info': currentApp && currentApp === 'general_information'
    };

    insights?.chrome?.appObjectId?.(entity?.id);

    if (entity) {
        document.title = `${entity.display_name} | Inventory | Red Hat Insights`;
    }

    return (
        <ScalprumComponent
            store={store}
            history={history}
            appName="chrome"
            module="./DetailWrapper"
            scope="chrome"
            onLoad={({ mergeWithDetail, INVENTORY_ACTION_TYPES }) => {
                getRegistry().register(mergeWithDetail(entitesDetailReducer(INVENTORY_ACTION_TYPES)));

                const removeListener = addNewListener({
                    actionType: INVENTORY_ACTION_TYPES.LOAD_ENTITY,
                    callback: ({ data }) => {
                        data.then(payload => {
                            loadEntity(payload.results[0].id);
                            removeListener();
                        });
                    }
                });

                SystemCvesStore && getRegistry().register({ SystemCvesStore });
                SystemAdvisoryListStore && getRegistry().register({ SystemAdvisoryListStore, SystemPackageListStore });
            }}
        >
            <PageHeader className={classnames('pf-m-light ins-inventory-detail', additionalClasses)} >
                <Breadcrumb>
                    <BreadcrumbItem>
                        <Link to={routes.table}>Inventory</Link>
                    </BreadcrumbItem>
                    <BreadcrumbItem isActive>
                        <div className="ins-c-inventory__detail--breadcrumb-name">
                            {
                                entity ?
                                    entity.display_name :
                                    <Skeleton size={SkeletonSize.xs} />
                            }
                        </div>
                    </BreadcrumbItem>
                </Breadcrumb>
                {
                    !loading && <ScalprumComponent
                        store={store}
                        history={history}
                        appName="chrome"
                        module="./InventoryDetail"
                        scope="chrome"
                        hideBack
                        showTags
                        hideInvLink
                        showDelete={writePermissions}
                        hideInvDrawer
                    />
                }
            </PageHeader>
            <Main className={classnames(additionalClasses)}>
                <Grid gutter="md">
                    <GridItem span={12}>
                        <ScalprumComponent
                            showTags
                            store={store}
                            history={history}
                            appName="chrome"
                            module="./AppInfo"
                            scope="chrome"
                        />
                    </GridItem>
                </Grid>
            </Main>
        </ScalprumComponent>
    );
};

Inventory.contextTypes = {
    store: PropTypes.object
};

Inventory.propTypes = {
    history: PropTypes.object,
    entity: PropTypes.object,
    loadEntity: PropTypes.func,
    clearNotifications: PropTypes.func,
    currentApp: PropTypes.string
};

function mapStateToProps({ entityDetails }) {
    const activeApp = entityDetails && entityDetails.activeApp && entityDetails.activeApp.appName;
    const firstApp = entityDetails && entityDetails.activeApps && entityDetails.activeApps[0];
    return {
        entity: entityDetails && entityDetails.entity,
        currentApp: activeApp || (firstApp && firstApp.name)
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadEntity: (id) => dispatch(actions.loadEntity(id)),
        clearNotifications: () => dispatch(actions.clearNotifications())
    };
}

export default routerParams(connect(mapStateToProps, mapDispatchToProps)(Inventory));
