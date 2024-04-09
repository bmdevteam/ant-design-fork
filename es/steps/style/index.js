import _extends from "@babel/runtime/helpers/esm/extends";
import { genComponentStyleHook, mergeToken } from '../../theme/internal';
import genStepsCustomIconStyle from './custom-icon';
import genStepsLabelPlacementStyle from './label-placement';
import genStepsNavStyle from './nav';
import genStepsProgressStyle from './progress';
import genStepsProgressDotStyle from './progress-dot';
import genStepsRTLStyle from './rtl';
import genStepsSmallStyle from './small';
import genStepsVerticalStyle from './vertical';
import genStepsInlineStyle from './inline';
import { resetComponent } from '../../style';
var StepItemStatusEnum;
(function (StepItemStatusEnum) {
  StepItemStatusEnum["wait"] = "wait";
  StepItemStatusEnum["process"] = "process";
  StepItemStatusEnum["finish"] = "finish";
  StepItemStatusEnum["error"] = "error";
})(StepItemStatusEnum || (StepItemStatusEnum = {}));
const genStepsItemStatusStyle = (status, token) => {
  const prefix = `${token.componentCls}-item`;
  const iconColorKey = `${status}IconColor`;
  const titleColorKey = `${status}TitleColor`;
  const descriptionColorKey = `${status}DescriptionColor`;
  const tailColorKey = `${status}TailColor`;
  const iconBgColorKey = `${status}IconBgColor`;
  const iconBorderColorKey = `${status}IconBorderColor`;
  const dotColorKey = `${status}DotColor`;
  return {
    [`${prefix}-${status} ${prefix}-icon`]: {
      backgroundColor: token[iconBgColorKey],
      borderColor: token[iconBorderColorKey],
      [`> ${token.componentCls}-icon`]: {
        color: token[iconColorKey],
        [`${token.componentCls}-icon-dot`]: {
          background: token[dotColorKey]
        }
      }
    },
    [`${prefix}-${status}${prefix}-custom ${prefix}-icon`]: {
      [`> ${token.componentCls}-icon`]: {
        color: token[dotColorKey]
      }
    },
    [`${prefix}-${status} > ${prefix}-container > ${prefix}-content > ${prefix}-title`]: {
      color: token[titleColorKey],
      '&::after': {
        backgroundColor: token[tailColorKey]
      }
    },
    [`${prefix}-${status} > ${prefix}-container > ${prefix}-content > ${prefix}-description`]: {
      color: token[descriptionColorKey]
    },
    [`${prefix}-${status} > ${prefix}-container > ${prefix}-tail::after`]: {
      backgroundColor: token[tailColorKey]
    }
  };
};
const genStepsItemStyle = token => {
  const {
    componentCls,
    motionDurationSlow
  } = token;
  const stepsItemCls = `${componentCls}-item`; // .ant-steps-item
  return _extends(_extends(_extends(_extends(_extends(_extends({
    [stepsItemCls]: {
      position: 'relative',
      display: 'inline-block',
      flex: 1,
      overflow: 'hidden',
      verticalAlign: 'top',
      '&:last-child': {
        flex: 'none',
        [`> ${stepsItemCls}-container > ${stepsItemCls}-tail, > ${stepsItemCls}-container >  ${stepsItemCls}-content > ${stepsItemCls}-title::after`]: {
          display: 'none'
        }
      }
    },
    [`${stepsItemCls}-container`]: {
      outline: 'none'
    },
    [`${stepsItemCls}-icon, ${stepsItemCls}-content`]: {
      display: 'inline-block',
      verticalAlign: 'top'
    },
    [`${stepsItemCls}-icon`]: {
      width: token.stepsIconSize,
      height: token.stepsIconSize,
      marginTop: 0,
      marginBottom: 0,
      marginInlineStart: 0,
      marginInlineEnd: token.marginXS,
      fontSize: token.stepsIconFontSize,
      fontFamily: token.fontFamily,
      lineHeight: `${token.stepsIconSize}px`,
      textAlign: 'center',
      borderRadius: token.stepsIconSize,
      border: `${token.lineWidth}px ${token.lineType} transparent`,
      transition: `background-color ${motionDurationSlow}, border-color ${motionDurationSlow}`,
      [`${componentCls}-icon`]: {
        position: 'relative',
        top: token.stepsIconTop,
        color: token.colorPrimary,
        lineHeight: 1
      }
    },
    [`${stepsItemCls}-tail`]: {
      position: 'absolute',
      top: token.stepsIconSize / 2 - token.paddingXXS,
      insetInlineStart: 0,
      width: '100%',
      '&::after': {
        display: 'inline-block',
        width: '100%',
        height: token.lineWidth,
        background: token.colorSplit,
        borderRadius: token.lineWidth,
        transition: `background ${motionDurationSlow}`,
        content: '""'
      }
    },
    [`${stepsItemCls}-title`]: {
      position: 'relative',
      display: 'inline-block',
      paddingInlineEnd: token.padding,
      color: token.colorText,
      fontSize: token.fontSizeLG,
      lineHeight: `${token.stepsTitleLineHeight}px`,
      '&::after': {
        position: 'absolute',
        top: token.stepsTitleLineHeight / 2,
        insetInlineStart: '100%',
        display: 'block',
        width: 9999,
        height: token.lineWidth,
        background: token.processTailColor,
        content: '""'
      }
    },
    [`${stepsItemCls}-subtitle`]: {
      display: 'inline',
      marginInlineStart: token.marginXS,
      color: token.colorTextDescription,
      fontWeight: 'normal',
      fontSize: token.fontSize
    },
    [`${stepsItemCls}-description`]: {
      color: token.colorTextDescription,
      fontSize: token.fontSize
    }
  }, genStepsItemStatusStyle(StepItemStatusEnum.wait, token)), genStepsItemStatusStyle(StepItemStatusEnum.process, token)), {
    [`${stepsItemCls}-process > ${stepsItemCls}-container > ${stepsItemCls}-title`]: {
      fontWeight: token.fontWeightStrong
    }
  }), genStepsItemStatusStyle(StepItemStatusEnum.finish, token)), genStepsItemStatusStyle(StepItemStatusEnum.error, token)), {
    [`${stepsItemCls}${componentCls}-next-error > ${componentCls}-item-title::after`]: {
      background: token.colorError
    },
    [`${stepsItemCls}-disabled`]: {
      cursor: 'not-allowed'
    }
  });
};
// ============================= Clickable ===========================
const genStepsClickableStyle = token => {
  const {
    componentCls,
    motionDurationSlow
  } = token;
  return {
    [`& ${componentCls}-item`]: {
      [`&:not(${componentCls}-item-active)`]: {
        [`& > ${componentCls}-item-container[role='button']`]: {
          cursor: 'pointer',
          [`${componentCls}-item`]: {
            [`&-title, &-subtitle, &-description, &-icon ${componentCls}-icon`]: {
              transition: `color ${motionDurationSlow}`
            }
          },
          '&:hover': {
            [`${componentCls}-item`]: {
              [`&-title, &-subtitle, &-description`]: {
                color: token.colorPrimary
              }
            }
          }
        },
        [`&:not(${componentCls}-item-process)`]: {
          [`& > ${componentCls}-item-container[role='button']:hover`]: {
            [`${componentCls}-item`]: {
              '&-icon': {
                borderColor: token.colorPrimary,
                [`${componentCls}-icon`]: {
                  color: token.colorPrimary
                }
              }
            }
          }
        }
      }
    },
    [`&${componentCls}-horizontal:not(${componentCls}-label-vertical)`]: {
      [`${componentCls}-item`]: {
        paddingInlineStart: token.padding,
        whiteSpace: 'nowrap',
        '&:first-child': {
          paddingInlineStart: 0
        },
        [`&:last-child ${componentCls}-item-title`]: {
          paddingInlineEnd: 0
        },
        '&-tail': {
          display: 'none'
        },
        '&-description': {
          maxWidth: token.descriptionWidth,
          whiteSpace: 'normal'
        }
      }
    }
  };
};
const genStepsStyle = token => {
  const {
    componentCls
  } = token; // .ant-steps
  return {
    [componentCls]: _extends(_extends(_extends(_extends(_extends(_extends(_extends(_extends(_extends(_extends(_extends(_extends(_extends({}, resetComponent(token)), {
      display: 'flex',
      width: '100%',
      fontSize: 0,
      textAlign: 'initial'
    }), genStepsItemStyle(token)), genStepsClickableStyle(token)), genStepsCustomIconStyle(token)), genStepsSmallStyle(token)), genStepsVerticalStyle(token)), genStepsLabelPlacementStyle(token)), genStepsProgressDotStyle(token)), genStepsNavStyle(token)), genStepsRTLStyle(token)), genStepsProgressStyle(token)), genStepsInlineStyle(token))
  };
};
// ============================== Export ==============================
export default genComponentStyleHook('Steps', token => {
  const {
    wireframe,
    colorTextDisabled,
    fontSizeHeading3,
    fontSize,
    controlHeight,
    controlHeightLG,
    colorTextLightSolid,
    colorText,
    colorPrimary,
    colorTextLabel,
    colorTextDescription,
    colorTextQuaternary,
    colorFillContent,
    controlItemBgActive,
    colorError,
    colorBgContainer,
    colorBorderSecondary
  } = token;
  const stepsIconSize = token.controlHeight;
  const processTailColor = token.colorSplit;
  const stepsToken = mergeToken(token, {
    // Steps variable default.less
    processTailColor,
    stepsNavArrowColor: colorTextDisabled,
    stepsIconSize,
    stepsIconCustomSize: stepsIconSize,
    stepsIconCustomTop: 0,
    stepsIconCustomFontSize: controlHeightLG / 2,
    stepsIconTop: -0.5,
    stepsIconFontSize: fontSize,
    stepsTitleLineHeight: controlHeight,
    stepsSmallIconSize: fontSizeHeading3,
    stepsDotSize: controlHeight / 4,
    stepsCurrentDotSize: controlHeightLG / 4,
    stepsNavContentMaxWidth: 'auto',
    // Steps component less variable
    processIconColor: colorTextLightSolid,
    processTitleColor: colorText,
    processDescriptionColor: colorText,
    processIconBgColor: colorPrimary,
    processIconBorderColor: colorPrimary,
    processDotColor: colorPrimary,
    waitIconColor: wireframe ? colorTextDisabled : colorTextLabel,
    waitTitleColor: colorTextDescription,
    waitDescriptionColor: colorTextDescription,
    waitTailColor: processTailColor,
    waitIconBgColor: wireframe ? colorBgContainer : colorFillContent,
    waitIconBorderColor: wireframe ? colorTextDisabled : 'transparent',
    waitDotColor: colorTextDisabled,
    finishIconColor: colorPrimary,
    finishTitleColor: colorText,
    finishDescriptionColor: colorTextDescription,
    finishTailColor: colorPrimary,
    finishIconBgColor: wireframe ? colorBgContainer : controlItemBgActive,
    finishIconBorderColor: wireframe ? colorPrimary : controlItemBgActive,
    finishDotColor: colorPrimary,
    errorIconColor: colorTextLightSolid,
    errorTitleColor: colorError,
    errorDescriptionColor: colorError,
    errorTailColor: processTailColor,
    errorIconBgColor: colorError,
    errorIconBorderColor: colorError,
    errorDotColor: colorError,
    stepsNavActiveColor: colorPrimary,
    stepsProgressSize: controlHeightLG,
    // Steps inline variable
    inlineDotSize: 6,
    inlineTitleColor: colorTextQuaternary,
    inlineTailColor: colorBorderSecondary
  });
  return [genStepsStyle(stepsToken)];
}, {
  descriptionWidth: 140
});