package com.bytedance.android.shopping.store.home.presenter;

import X.0gbq;
import X.0jL8;
import X.0jcn;
import X.0jg3;
import X.1EmG;
import X.AbstractC13740Lyj;
import X.AbstractC17100M9x;
import X.C0MLL;
import X.C0N8I;
import X.C0NM1;
import X.C35630Msw;
import X.C35640Msx;
import X.C40740N2v;
import android.graphics.drawable.Drawable;
import android.graphics.drawable.GradientDrawable;
import android.view.View;
import android.view.ViewGroup;
import androidx.fragment.app.Fragment;
import com.GlobalProxyLancet;
import com.bytedance.android.ec.model.ECUrlModel;
import com.bytedance.android.shopping.store.home.entity.ECShopBrandHeaderStyleDto;
import com.bytedance.android.shopping.store.home.presenter.ECShopBackgroundPresenterBrand;
import com.bytedance.android.ui.ec.widget.ecdraweeview.ECDraweeView;
import com.bytedance.memoryx.StringBuilderCache;
import com.facebook.drawee.interfaces.DraweeController;
import com.facebook.drawee.view.DraweeView;
import com.ss.android.ugc.aweme.compat.nullable.Observer;
import com.ss.android.ugc.aweme.kiwi.model.QModel;
import com.ss.android.ugc.bytex.async.stack.broken_chain.CallbackRunnable;
import com.ss.android.ugc.bytex.async.stack.transmitter.AsyncContext;
import kotlin.Lazy;
import kotlin.LazyKt__LazyJVMKt;
import kotlin.jvm.internal.ALambdaS4430S0100000_13;
import kotlin.jvm.internal.Intrinsics;
import kotlin.ranges.RangesKt;

/* JADX INFO: loaded from: /Users/yiming/Documents/Codex/2026-11-17/wo-x/work/douyin-inspect/dex/classes6.dex */
public final class ECShopBackgroundPresenterBrand extends ECShopBasePresenter {
    public final Lazy background$delegate;
    public final Lazy backgroundBottomGradient$delegate;
    public int backgroundBottomGradientHeight;
    public int backgroundHeight;
    public final Lazy backgroundMask$delegate;
    public final Lazy backgroundMaskImage$delegate;
    public int backgroundWidth;
    public final Lazy backgroundWrapper$delegate;
    public float croppedOriginY;
    public boolean hasBackgroundMaskImage;
    public final Runnable measureBackground;
    public boolean needBackgroundMask;
    public boolean needTopBarMask;
    public ECDraweeView topBarBackgroundView;
    public ViewGroup topBarBackgroundViewWrapper;
    public View topbarBackgroundMask;
    public boolean usesBrandBackground;

    public final ECDraweeView LLZIL() {
        return (ECDraweeView) this.background$delegate.getValue();
    }

    public final View LLZILL() {
        return (View) this.backgroundBottomGradient$delegate.getValue();
    }

    public final View LLZL() {
        return (View) this.backgroundMask$delegate.getValue();
    }

    public final ECDraweeView LLZLI() {
        return (ECDraweeView) this.backgroundMaskImage$delegate.getValue();
    }

    public final ViewGroup LLZLLLL() {
        return (ViewGroup) this.backgroundWrapper$delegate.getValue();
    }

    public final void onUnBind() {
        0gbq.LJIIJ(getView(), this.measureBackground);
        this.usesBrandBackground = false;
        super.onUnBind();
    }

    public final void LLZZ() {
        ECDraweeView eCDraweeViewLLZIL = LLZIL();
        if (eCDraweeViewLLZIL != null) {
            Integer numValueOf = Integer.valueOf(eCDraweeViewLLZIL.getMeasuredHeight());
            if (numValueOf.intValue() > 0) {
                int iIntValue = numValueOf.intValue();
                View viewLLZL = LLZL();
                if (viewLLZL != null) {
                    AbstractC17100M9x.LIZLLL(viewLLZL, iIntValue);
                }
                ECDraweeView eCDraweeViewLLZLI = LLZLI();
                if (eCDraweeViewLLZLI != null) {
                    AbstractC17100M9x.LIZLLL(eCDraweeViewLLZLI, iIntValue);
                }
            }
        }
    }

    public ECShopBackgroundPresenterBrand(Fragment fragment) {
        super(fragment);
        this.background$delegate = LazyKt__LazyJVMKt.lazy(new ALambdaS4430S0100000_13(this, 177));
        this.backgroundMask$delegate = LazyKt__LazyJVMKt.lazy(new ALambdaS4430S0100000_13(this, 182));
        this.backgroundMaskImage$delegate = LazyKt__LazyJVMKt.lazy(new ALambdaS4430S0100000_13(this, 185));
        this.backgroundWrapper$delegate = LazyKt__LazyJVMKt.lazy(new ALambdaS4430S0100000_13(this, 136));
        this.backgroundBottomGradient$delegate = LazyKt__LazyJVMKt.lazy(new ALambdaS4430S0100000_13(this, 180));
        this.measureBackground = new Runnable() { // from class: X.0MVD
            public AsyncContext _async_context;
            public CallbackRunnable _d_p;

            @Override // java.lang.Runnable
            public final void run() {
                int measuredHeight;
                int measuredHeight2;
                ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand = this.a;
                if (eCShopBackgroundPresenterBrand.usesBrandBackground) {
                    View viewLLZILL = eCShopBackgroundPresenterBrand.LLZILL();
                    int measuredWidth = 0;
                    if (viewLLZILL != null) {
                        measuredHeight = viewLLZILL.getMeasuredHeight();
                    } else {
                        measuredHeight = 0;
                    }
                    eCShopBackgroundPresenterBrand.backgroundBottomGradientHeight = measuredHeight;
                    ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand2 = this.a;
                    ViewGroup viewGroupLLZLLLL = eCShopBackgroundPresenterBrand2.LLZLLLL();
                    if (viewGroupLLZLLLL != null) {
                        measuredHeight2 = viewGroupLLZLLLL.getMeasuredHeight();
                    } else {
                        measuredHeight2 = 0;
                    }
                    eCShopBackgroundPresenterBrand2.backgroundHeight = measuredHeight2;
                    ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand3 = this.a;
                    ViewGroup viewGroupLLZLLLL2 = eCShopBackgroundPresenterBrand3.LLZLLLL();
                    if (viewGroupLLZLLLL2 != null) {
                        measuredWidth = viewGroupLLZLLLL2.getMeasuredWidth();
                    }
                    eCShopBackgroundPresenterBrand3.backgroundWidth = measuredWidth;
                    this.a.LLZZ();
                }
            }
        };
    }

    public final void onBind(QModel qModel) {
        final View viewLLLZLL = LLLZLL();
        if (LLLLL().k) {
            this.topBarBackgroundView = GlobalProxyLancet.E(2131376129, viewLLLZLL);
            this.topBarBackgroundViewWrapper = (ViewGroup) GlobalProxyLancet.E(2131376131, viewLLLZLL);
            this.topbarBackgroundMask = GlobalProxyLancet.E(2131376130, viewLLLZLL);
        }
        LLLLL().q.LIZ(LLLLLJLJLL(), new Observer() { // from class: com.bytedance.android.shopping.store.home.presenter.ECShopBackgroundPresenterBrand.onBind.1
            public final void onChanged(Object obj) {
                ECUrlModel headerBackgroundImg;
                ECUrlModel headerBackgroundMaskImage;
                boolean z;
                float fFloatValue;
                float fFloatValue2;
                int i;
                int iIntValue;
                float fFloatValue3;
                ECShopBrandHeaderStyleDto eCShopBrandHeaderStyleDtoLJ;
                C0MLL c0mll = (C0MLL) obj;
                if (c0mll != null) {
                    ECShopBackgroundPresenterBrand.this.usesBrandBackground = c0mll.LJJ();
                    ECShopBrandHeaderStyleDto eCShopBrandHeaderStyleDtoLJ2 = c0mll.LJ();
                    View view = null;
                    if (eCShopBrandHeaderStyleDtoLJ2 != null) {
                        headerBackgroundImg = eCShopBrandHeaderStyleDtoLJ2.getHeaderBackgroundImg();
                    } else {
                        headerBackgroundImg = null;
                    }
                    ECShopBrandHeaderStyleDto eCShopBrandHeaderStyleDtoLJ3 = c0mll.LJ();
                    if (eCShopBrandHeaderStyleDtoLJ3 != null) {
                        headerBackgroundMaskImage = eCShopBrandHeaderStyleDtoLJ3.getHeaderBackgroundMaskImage();
                    } else {
                        headerBackgroundMaskImage = null;
                    }
                    ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand = ECShopBackgroundPresenterBrand.this;
                    if (eCShopBackgroundPresenterBrand.usesBrandBackground && (eCShopBrandHeaderStyleDtoLJ = c0mll.LJ()) != null && Intrinsics.areEqual(eCShopBrandHeaderStyleDtoLJ.getNeedHeaderBackgroundMask(), Boolean.TRUE)) {
                        z = true;
                    } else {
                        z = false;
                    }
                    eCShopBackgroundPresenterBrand.needBackgroundMask = z;
                    ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand2 = ECShopBackgroundPresenterBrand.this;
                    eCShopBackgroundPresenterBrand2.needTopBarMask = eCShopBackgroundPresenterBrand2.usesBrandBackground;
                    0gbq.LJIIJ(eCShopBackgroundPresenterBrand2.getView(), ECShopBackgroundPresenterBrand.this.measureBackground);
                    ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand3 = ECShopBackgroundPresenterBrand.this;
                    if (eCShopBackgroundPresenterBrand3.usesBrandBackground) {
                        View viewLIZ = AbstractC13740Lyj.LIZ(eCShopBackgroundPresenterBrand3.getQuery().find(2131375979));
                        if (viewLIZ != null) {
                            viewLIZ.setVisibility(0);
                        }
                        ViewGroup viewGroupLLZLLLL = ECShopBackgroundPresenterBrand.this.LLZLLLL();
                        if (viewGroupLLZLLLL != null) {
                            AbstractC17100M9x.LIZLLL(viewGroupLLZLLLL, 0jg3.LIZIZ(375));
                            AbstractC17100M9x.LJIIIIZZ(-1, viewGroupLLZLLLL);
                            1EmG.LIZLLL(viewGroupLLZLLLL, 0, 0, 0, 0);
                            viewGroupLLZLLLL.setBackgroundColor(-16777216);
                        }
                        ECDraweeView eCDraweeViewLLZIL = ECShopBackgroundPresenterBrand.this.LLZIL();
                        if (eCDraweeViewLLZIL != null) {
                            ECShopBackgroundPresenterBrand.this.LLLZZ(eCDraweeViewLLZIL, headerBackgroundImg);
                            eCDraweeViewLLZIL.setVisibility(0);
                        }
                        0gbq.LJI(ECShopBackgroundPresenterBrand.this.getView(), ECShopBackgroundPresenterBrand.this.measureBackground);
                        ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand4 = ECShopBackgroundPresenterBrand.this;
                        float fFloatValue4 = 0.0f;
                        if (eCShopBackgroundPresenterBrand4.needBackgroundMask) {
                            View viewLLZL = eCShopBackgroundPresenterBrand4.LLZL();
                            Float f = (Float) ECShopBackgroundPresenterBrand.this.LLLLL().P1.getValue();
                            if (f != null) {
                                fFloatValue3 = f.floatValue();
                            } else {
                                fFloatValue3 = 0.0f;
                            }
                            ECShopBackgroundPresenterBrand.LLZZLLIL(viewLLZL, fFloatValue3);
                        }
                        ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand5 = ECShopBackgroundPresenterBrand.this;
                        ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand6 = ECShopBackgroundPresenterBrand.this;
                        eCShopBackgroundPresenterBrand5.hasBackgroundMaskImage = eCShopBackgroundPresenterBrand6.LLLZZIL(eCShopBackgroundPresenterBrand6.LLZLI(), headerBackgroundMaskImage);
                        ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand7 = ECShopBackgroundPresenterBrand.this;
                        ECDraweeView eCDraweeViewLLZLI = eCShopBackgroundPresenterBrand7.LLZLI();
                        Float f2 = (Float) ECShopBackgroundPresenterBrand.this.LLLLL().P1.getValue();
                        if (f2 != null) {
                            fFloatValue = f2.floatValue();
                        } else {
                            fFloatValue = 0.0f;
                        }
                        eCShopBackgroundPresenterBrand7.LLZZZIL(eCDraweeViewLLZLI, fFloatValue);
                        if (ECShopBackgroundPresenterBrand.this.LLLLL().k) {
                            View viewLIZ2 = AbstractC13740Lyj.LIZ(ECShopBackgroundPresenterBrand.this.getQuery().find(2131375979));
                            if (viewLIZ2 != null) {
                                viewLIZ2.setBackgroundColor(0);
                            }
                            GlobalProxyLancet.E(2131375997, viewLLLZLL).setPadding(0, 0, 0, 0);
                            ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand8 = ECShopBackgroundPresenterBrand.this;
                            ECDraweeView eCDraweeView = eCShopBackgroundPresenterBrand8.topBarBackgroundView;
                            if (eCDraweeView == null) {
                                Intrinsics.throwUninitializedPropertyAccessException("");
                                eCDraweeView = null;
                            }
                            eCShopBackgroundPresenterBrand8.LLLZZ(eCDraweeView, headerBackgroundImg);
                            ViewGroup viewGroup = ECShopBackgroundPresenterBrand.this.topBarBackgroundViewWrapper;
                            if (viewGroup == null) {
                                Intrinsics.throwUninitializedPropertyAccessException("");
                                viewGroup = null;
                            }
                            ECShopBackgroundPresenterBrand.this.getClass();
                            AbstractC17100M9x.LIZLLL(viewGroup, 0jL8.LJIILIIL() + 0jg3.LIZIZ(44));
                            viewGroup.setBackgroundColor(-16777216);
                            viewGroup.setVisibility(0);
                            ECDraweeView eCDraweeViewLLZIL2 = ECShopBackgroundPresenterBrand.this.LLZIL();
                            if (eCDraweeViewLLZIL2 != null) {
                                ECShopBackgroundPresenterBrand.this.getClass();
                                1EmG.LIZLLL(eCDraweeViewLLZIL2, 0, -(0jL8.LJIILIIL() + 0jg3.LIZIZ(44)), 0, 0);
                            }
                            View viewLLZL2 = ECShopBackgroundPresenterBrand.this.LLZL();
                            if (viewLLZL2 != null) {
                                ECShopBackgroundPresenterBrand.this.getClass();
                                1EmG.LIZLLL(viewLLZL2, 0, -(0jL8.LJIILIIL() + 0jg3.LIZIZ(44)), 0, 0);
                            }
                            Float f3 = (Float) ECShopBackgroundPresenterBrand.this.LLLLL().V1.getValue();
                            if (f3 != null) {
                                fFloatValue2 = f3.floatValue();
                            } else {
                                fFloatValue2 = 0.0f;
                            }
                            float fCoerceIn = (1.0f - RangesKt.coerceIn(fFloatValue2, 0.0f, 1.0f)) * 20.0f;
                            ViewGroup viewGroupLLZLLLL2 = ECShopBackgroundPresenterBrand.this.LLZLLLL();
                            if (viewGroupLLZLLLL2 != null) {
                                0jcn.LJFF(viewGroupLLZLLLL2, fCoerceIn, fCoerceIn, 0.0f, 0.0f);
                            }
                            ECShopBackgroundPresenterBrand.this.croppedOriginY = (C0N8I.LIZJ() - C0N8I.LIZIZ()) - 0jL8.LJ();
                            ViewGroup viewGroupLLZLLLL3 = ECShopBackgroundPresenterBrand.this.LLZLLLL();
                            if (viewGroupLLZLLLL3 != null) {
                                ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand9 = ECShopBackgroundPresenterBrand.this;
                                float f4 = eCShopBackgroundPresenterBrand9.croppedOriginY;
                                Integer num = (Integer) eCShopBackgroundPresenterBrand9.LLLLL().M1.getValue();
                                if (num != null) {
                                    iIntValue = num.intValue();
                                } else {
                                    iIntValue = 0;
                                }
                                viewGroupLLZLLLL3.setY(f4 - iIntValue);
                            }
                            View view2 = ECShopBackgroundPresenterBrand.this.topbarBackgroundMask;
                            if (view2 == null) {
                                Intrinsics.throwUninitializedPropertyAccessException("");
                                view2 = null;
                            }
                            Float f5 = (Float) ECShopBackgroundPresenterBrand.this.LLLLL().P1.getValue();
                            if (f5 != null) {
                                fFloatValue4 = f5.floatValue();
                            }
                            ECShopBackgroundPresenterBrand.LLZZLLIL(view2, fFloatValue4);
                            View view3 = ECShopBackgroundPresenterBrand.this.topbarBackgroundMask;
                            if (view3 == null) {
                                Intrinsics.throwUninitializedPropertyAccessException("");
                            } else {
                                view = view3;
                            }
                            if (ECShopBackgroundPresenterBrand.this.needTopBarMask) {
                                i = 0;
                            } else {
                                i = 8;
                            }
                            view.setVisibility(i);
                        }
                    } else {
                        View viewLIZ3 = AbstractC13740Lyj.LIZ(eCShopBackgroundPresenterBrand3.getQuery().find(2131375979));
                        if (viewLIZ3 != null) {
                            viewLIZ3.setVisibility(8);
                        }
                        ECDraweeView eCDraweeViewLLZIL3 = ECShopBackgroundPresenterBrand.this.LLZIL();
                        if (eCDraweeViewLLZIL3 != null) {
                            eCDraweeViewLLZIL3.setController((DraweeController) null);
                        }
                        ECDraweeView eCDraweeViewLLZIL4 = ECShopBackgroundPresenterBrand.this.LLZIL();
                        if (eCDraweeViewLLZIL4 != null) {
                            eCDraweeViewLLZIL4.setVisibility(8);
                        }
                        View viewLLZL3 = ECShopBackgroundPresenterBrand.this.LLZL();
                        if (viewLLZL3 != null) {
                            viewLLZL3.setVisibility(8);
                        }
                        ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand10 = ECShopBackgroundPresenterBrand.this;
                        eCShopBackgroundPresenterBrand10.LLLZZIL(eCShopBackgroundPresenterBrand10.LLZLI(), null);
                        ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand11 = ECShopBackgroundPresenterBrand.this;
                        eCShopBackgroundPresenterBrand11.hasBackgroundMaskImage = false;
                        if (eCShopBackgroundPresenterBrand11.topBarBackgroundViewWrapper != null) {
                            DraweeView draweeView = eCShopBackgroundPresenterBrand11.topBarBackgroundView;
                            if (draweeView == null) {
                                Intrinsics.throwUninitializedPropertyAccessException("");
                                draweeView = null;
                            }
                            draweeView.setController((DraweeController) null);
                            ViewGroup viewGroup2 = ECShopBackgroundPresenterBrand.this.topBarBackgroundViewWrapper;
                            if (viewGroup2 == null) {
                                Intrinsics.throwUninitializedPropertyAccessException("");
                            } else {
                                view = viewGroup2;
                            }
                            view.setVisibility(8);
                        }
                    }
                    ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand12 = ECShopBackgroundPresenterBrand.this;
                    if (eCShopBackgroundPresenterBrand12.needBackgroundMask) {
                        View viewLLZL4 = eCShopBackgroundPresenterBrand12.LLZL();
                        if (viewLLZL4 != null) {
                            viewLLZL4.setVisibility(0);
                            return;
                        }
                        return;
                    }
                    View viewLLZL5 = eCShopBackgroundPresenterBrand12.LLZL();
                    if (viewLLZL5 == null) {
                        return;
                    }
                    viewLLZL5.setVisibility(8);
                }
            }
        }, false);
        LLLLL().P1.LIZ(LLLLLJLJLL(), new Observer() { // from class: com.bytedance.android.shopping.store.home.presenter.ECShopBackgroundPresenterBrand.onBind.2
            public final void onChanged(Object obj) {
                View view;
                Float f = (Float) obj;
                ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand = ECShopBackgroundPresenterBrand.this;
                if (eCShopBackgroundPresenterBrand.usesBrandBackground) {
                    if (eCShopBackgroundPresenterBrand.needBackgroundMask && f.floatValue() >= 0.0f) {
                        View viewLLZL = ECShopBackgroundPresenterBrand.this.LLZL();
                        Intrinsics.checkNotNull(f);
                        ECShopBackgroundPresenterBrand.LLZZLLIL(viewLLZL, f.floatValue());
                    }
                    if (ECShopBackgroundPresenterBrand.this.needTopBarMask && f.floatValue() >= 0.0f && (view = ECShopBackgroundPresenterBrand.this.topbarBackgroundMask) != null) {
                        Intrinsics.checkNotNull(f);
                        ECShopBackgroundPresenterBrand.LLZZLLIL(view, f.floatValue());
                    }
                    ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand2 = ECShopBackgroundPresenterBrand.this;
                    ECDraweeView eCDraweeViewLLZLI = eCShopBackgroundPresenterBrand2.LLZLI();
                    Intrinsics.checkNotNull(f);
                    eCShopBackgroundPresenterBrand2.LLZZZIL(eCDraweeViewLLZLI, f.floatValue());
                }
            }
        }, false);
        LLLLL().M1.LIZ(LLLLLJLJLL(), new Observer() { // from class: com.bytedance.android.shopping.store.home.presenter.ECShopBackgroundPresenterBrand.onBind.3
            public final void onChanged(Object obj) {
                Integer num = (Integer) obj;
                ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand = ECShopBackgroundPresenterBrand.this;
                if (eCShopBackgroundPresenterBrand.usesBrandBackground) {
                    if (eCShopBackgroundPresenterBrand.LLLLL().k) {
                        ViewGroup viewGroupLLZLLLL = ECShopBackgroundPresenterBrand.this.LLZLLLL();
                        if (viewGroupLLZLLLL != null) {
                            float f = ECShopBackgroundPresenterBrand.this.croppedOriginY;
                            Intrinsics.checkNotNull(num);
                            viewGroupLLZLLLL.setY(f - num.intValue());
                            return;
                        }
                        return;
                    }
                    if (num.intValue() > 0) {
                        return;
                    }
                    final ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand2 = ECShopBackgroundPresenterBrand.this;
                    Intrinsics.checkNotNull(num);
                    int iIntValue = num.intValue();
                    if (eCShopBackgroundPresenterBrand2.backgroundHeight <= 0) {
                        return;
                    }
                    C35640Msx.LIZ.getClass();
                    C35630Msw c35630MswLIZ = C35640Msx.LIZ("ECShopBackgroundPresenterBrand");
                    StringBuilder sb = StringBuilderCache.get();
                    sb.append("updatebgSize ");
                    sb.append(iIntValue);
                    c35630MswLIZ.LIZ(StringBuilderCache.release(sb));
                    int iAbs = eCShopBackgroundPresenterBrand2.backgroundHeight + Math.abs(iIntValue);
                    int i = (eCShopBackgroundPresenterBrand2.backgroundWidth * iAbs) / eCShopBackgroundPresenterBrand2.backgroundHeight;
                    ViewGroup viewGroupLLZLLLL2 = eCShopBackgroundPresenterBrand2.LLZLLLL();
                    if (viewGroupLLZLLLL2 != null) {
                        AbstractC17100M9x.LIZLLL(viewGroupLLZLLLL2, iAbs);
                        AbstractC17100M9x.LJIIIIZZ(i, viewGroupLLZLLLL2);
                        1EmG.LIZLLL(viewGroupLLZLLLL2, (-(i - eCShopBackgroundPresenterBrand2.backgroundWidth)) / 2, 0, 0, 0);
                        0gbq.LJI(viewGroupLLZLLLL2, new Runnable() { // from class: X.0MVE
                            public AsyncContext _async_context;
                            public CallbackRunnable _d_p;

                            @Override // java.lang.Runnable
                            public final void run() {
                                eCShopBackgroundPresenterBrand2.LLZZ();
                            }
                        });
                    }
                    View viewLLZILL = eCShopBackgroundPresenterBrand2.LLZILL();
                    if (viewLLZILL == null) {
                        return;
                    }
                    AbstractC17100M9x.LIZLLL(viewLLZILL, (eCShopBackgroundPresenterBrand2.backgroundBottomGradientHeight * iAbs) / eCShopBackgroundPresenterBrand2.backgroundHeight);
                    AbstractC17100M9x.LJIIIIZZ((eCShopBackgroundPresenterBrand2.backgroundWidth * iAbs) / eCShopBackgroundPresenterBrand2.backgroundHeight, viewLLZILL);
                }
            }
        }, false);
        LLLLL().V1.LIZ(LLLLLJLJLL(), new Observer() { // from class: com.bytedance.android.shopping.store.home.presenter.ECShopBackgroundPresenterBrand.onBind.4
            public final void onChanged(Object obj) {
                Float f = (Float) obj;
                ECShopBackgroundPresenterBrand eCShopBackgroundPresenterBrand = ECShopBackgroundPresenterBrand.this;
                if (eCShopBackgroundPresenterBrand.usesBrandBackground && eCShopBackgroundPresenterBrand.LLLLL().k && f.floatValue() >= 0.0f) {
                    Intrinsics.checkNotNull(f);
                    float fCoerceIn = (1.0f - RangesKt.coerceIn(f.floatValue(), 0.0f, 1.0f)) * 20.0f;
                    ViewGroup viewGroupLLZLLLL = ECShopBackgroundPresenterBrand.this.LLZLLLL();
                    if (viewGroupLLZLLLL != null) {
                        0jcn.LJFF(viewGroupLLZLLLL, fCoerceIn, fCoerceIn, 0.0f, 0.0f);
                    }
                }
            }
        }, false);
    }

    public final void LLLZZ(ECDraweeView eCDraweeView, ECUrlModel eCUrlModel) {
        String strLIZIZ;
        if (eCUrlModel != null && (strLIZIZ = eCUrlModel.LIZIZ()) != null && strLIZIZ.length() != 0) {
            C40740N2v.LIZLLL(eCDraweeView, eCUrlModel, LLLLL().WD(), null, null, null, null, 120);
        } else {
            eCDraweeView.setController((DraweeController) null);
        }
    }

    public final boolean LLLZZIL(ECDraweeView eCDraweeView, ECUrlModel eCUrlModel) {
        String strLIZIZ;
        if (eCUrlModel != null) {
            strLIZIZ = eCUrlModel.LIZIZ();
        } else {
            strLIZIZ = null;
        }
        if (eCDraweeView != null) {
            if (strLIZIZ != null && strLIZIZ.length() != 0) {
                C40740N2v.LIZLLL(eCDraweeView, eCUrlModel, LLLLL().WD(), null, null, null, null, 120);
                eCDraweeView.setAlpha(1.0f);
                eCDraweeView.setVisibility(0);
                return true;
            }
            eCDraweeView.setController((DraweeController) null);
            eCDraweeView.setVisibility(8);
        }
        return false;
    }

    public final void LLZZZIL(ECDraweeView eCDraweeView, float f) {
        int i;
        if (this.hasBackgroundMaskImage && eCDraweeView != null) {
            float fCoerceIn = RangesKt.coerceIn(1.0f - RangesKt.coerceIn(f, 0.0f, 1.0f), 0.0f, 1.0f);
            eCDraweeView.setAlpha(fCoerceIn);
            if (fCoerceIn <= 0.01f) {
                i = 8;
            } else {
                i = 0;
            }
            eCDraweeView.setVisibility(i);
        }
    }

    public static void LLZZLLIL(View view, float f) {
        GradientDrawable gradientDrawable;
        if (view == null) {
            return;
        }
        int iCoerceIn = (int) (51 + (102 * RangesKt.coerceIn(f, 0.0f, 1.0f)));
        Drawable background = view.getBackground();
        if (!(background instanceof GradientDrawable) || (gradientDrawable = (GradientDrawable) background) == null) {
            gradientDrawable = new GradientDrawable();
        }
        gradientDrawable.setOrientation(GradientDrawable.Orientation.TOP_BOTTOM);
        gradientDrawable.setColors(new int[]{iCoerceIn << 24, -1040187392, -16777216});
        gradientDrawable.setGradientCenter(0.5f, 0.5f);
        gradientDrawable.setGradientType(0);
        gradientDrawable.setShape(0);
        C0NM1.LIZ(view, gradientDrawable);
    }
}
