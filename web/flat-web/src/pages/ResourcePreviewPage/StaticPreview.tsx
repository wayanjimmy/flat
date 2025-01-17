import "./StaticPreview.less";

import { observer } from "mobx-react-lite";
import { Region } from "flat-components";
import React, { useEffect, useState } from "react";
import { queryConvertingTaskStatus } from "../../api-middleware/courseware-converting";
import { useSafePromise } from "../../utils/hooks/lifecycle";

export interface StaticPreviewProps {
    taskUUID: string;
    taskToken: string;
    region: Region;
}

type ConvertedFileList =
    | Array<{
          width: number;
          height: number;
          conversionFileUrl: string;
          preview?: string | undefined;
      }>
    | undefined;

export const StaticPreview = observer<StaticPreviewProps>(function DocumentPreview({
    taskUUID,
    taskToken,
    region,
}) {
    const [convertList, setConvertList] = useState<ConvertedFileList>([]);
    const sp = useSafePromise();

    useEffect(() => {
        async function getStaticResource(): Promise<void> {
            const convertResult = await sp(
                queryConvertingTaskStatus({
                    taskUUID,
                    taskToken,
                    dynamic: false,
                    region,
                    projector: false,
                }),
            );

            setConvertList(convertResult.progress?.convertedFileList);
        }

        getStaticResource().catch(console.warn);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="static-preview-container">
            <div className="static-preview-list">
                {convertList?.map(file => {
                    return (
                        <img
                            key={file.conversionFileUrl}
                            className="static-preview-item"
                            src={file.conversionFileUrl}
                        ></img>
                    );
                })}
            </div>
        </div>
    );
});
