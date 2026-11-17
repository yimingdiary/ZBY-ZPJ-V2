package com.bytedance.android.shopping.store.home.presenter;

import X.0iZM;
import X.0jFc;
import X.0jNK;
import X.AbstractC16950M9i;
import X.AbstractC40290N1c;
import X.C0MGT;
import X.C0MK0;
import X.C0MK7;
import X.C0MK8;
import X.C0MKP;
import X.C0MLL;
import X.C0MM0;
import X.C0MN0;
import X.C0MN6;
import X.C0MNR;
import X.C0MNT;
import X.C0MP4;
import X.C0MV2;
import X.C19920MKt;
import X.C20000MLb;
import X.C20050MLg;
import X.C20240MLz;
import X.C20400MMp;
import X.C20420MMr;
import X.C21350MQg;
import X.C22040MSx;
import X.C22530MUu;
import X.C35630Msw;
import X.C35640Msx;
import X.EnumC20040MLf;
import X.EnumC20080MLj;
import X.EnumC20410MMq;
import Y.ACListenerS851S0100000_13;
import android.view.View;
import android.view.ViewGroup;
import android.widget.FrameLayout;
import android.widget.TextView;
import androidx.fragment.app.Fragment;
import androidx.lifecycle.LifecycleOwner;
import com.GlobalProxyLancet;
import com.bytedance.android.btm.api.BtmSDK;
import com.bytedance.android.btm.api.model.PageFinder;
import com.bytedance.android.ecom.arch.slice.render.SlcTemplateViewInfo;
import com.bytedance.android.ecom.arch.slice.render.context.ISlcBindDataListener;
import com.bytedance.android.ecom.arch.slice.render.context.SlcRenderContext;
import com.bytedance.android.ecom.arch.slice.render.context.SlcTemplateContext;
import com.bytedance.android.shopping.store.home.entity.ECTopSearchInfo;
import com.bytedance.android.shopping.store.home.view.ECStoreCollapsibleTextView;
import com.bytedance.memoryx.StringBuilderCache;
import com.ss.android.ugc.aweme.compat.nullable.Observer;
import com.ss.android.ugc.aweme.kiwi.model.QModel;
import com.ss.android.ugc.bytex.kt_intermediate.lib.CheckNpeV2;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import kotlin.Lazy;
import kotlin.LazyKt__LazyJVMKt;
import kotlin.TuplesKt;
import kotlin.collections.CollectionsKt___CollectionsKt;
import kotlin.collections.MapsKt__MapsJVMKt;
import kotlin.collections.MapsKt__MapsKt;
import kotlin.jvm.internal.ALambdaS1716S0200000_13;
import kotlin.jvm.internal.ALambdaS275S1000000_13;
import kotlin.jvm.internal.ALambdaS757S0300000_13;
import kotlin.jvm.internal.Intrinsics;
import kotlin.jvm.internal.Reflection;
import kotlin.ranges.RangesKt;
import kotlin.text.StringsKt__StringsKt;

/* JADX INFO: loaded from: /Users/yiming/Documents/Codex/2026-11-17/wo-x/work/douyin-inspect/dex/classes6.dex */
public final class ECShopSliceTopBarPresenter extends ECShopBasePresenter {
    public static final C0MNR Companion = new Object() { // from class: X.0MNR
    };
    public ISlcBindDataListener bindDataListener;
    public final int[] headerInfoLocation;
    public boolean isInitedView;
    public ECStoreCollapsibleTextView searchView;
    public View shareButtonView;
    public final Lazy slcActionHandler$delegate;
    public ViewGroup sliceContainerView;
    public Map<String, ? extends Object> sliceDataMap;
    public View sliceInfoView;
    public Map<String, Object> sliceItemActions;
    public Map<String, Object> sliceItemExtra;
    public Map<String, Object> sliceItemStates;
    public View topBarInnerView;
    public final int[] topBarLocation;
    public SlcTemplateViewInfo viewInfo;

    public final void onUnBind() {
        ISlcBindDataListener iSlcBindDataListener = this.bindDataListener;
        if (iSlcBindDataListener != null) {
            C22530MUu c22530MUu = (C22530MUu) LLLLL().cE();
            c22530MUu.getClass();
            CheckNpeV2.throwNpe1(iSlcBindDataListener, 0);
            SlcRenderContext slcRenderContext = c22530MUu.LIZ;
            if (slcRenderContext != null) {
                0jNK.LIZ();
                ArrayList arrayList = slcRenderContext.LJIILIIL;
                if (arrayList != null) {
                    GlobalProxyLancet.LLZIL(iSlcBindDataListener, arrayList);
                }
            }
        }
        this.bindDataListener = null;
        this.topBarInnerView = null;
        super.onUnBind();
    }

    public final void LLZZ() {
        float fFloatValue;
        float fCoerceIn;
        if (LLLJ()) {
            LLZZLLIL((RangesKt.coerceIn(LLLZZIL(), 0.0f, 1.0f) * 0.16999999f) + 0.27f);
            LLZL();
            return;
        }
        C20420MMr c20420MMr = (C20420MMr) LLLLL().T1.getValue();
        if (c20420MMr != null && c20420MMr.LIZIZ > 0) {
            fCoerceIn = c20420MMr.LIZIZ();
        } else {
            Float f = (Float) LLLLL().V1.getValue();
            if (f != null) {
                fFloatValue = f.floatValue();
            } else {
                fFloatValue = 0.0f;
            }
            fCoerceIn = RangesKt.coerceIn(fFloatValue, 0.0f, 1.0f);
        }
        LLZZLLIL(fCoerceIn);
        LLZL();
    }

    public final void LLLZZ() {
        String str;
        Object obj;
        Map mapLJIILJJIL;
        if (this.sliceDataMap == null) {
            return;
        }
        LinkedHashMap linkedHashMap = new LinkedHashMap();
        linkedHashMap.putAll(this.sliceItemStates);
        linkedHashMap.putAll(((C22530MUu) LLLLL().cE()).LJ());
        linkedHashMap.put("timestamp", Long.valueOf(System.currentTimeMillis()));
        if (LLLLL().k) {
            str = "seven_split";
        } else {
            str = "";
        }
        linkedHashMap.put("modal", str);
        linkedHashMap.put("is_split_mode", Boolean.valueOf(LLLLL().h.H2));
        linkedHashMap.put("is_split_top", Boolean.valueOf(LLLLL().h.T2));
        LinkedHashMap linkedHashMap2 = new LinkedHashMap();
        Map<String, ? extends Object> mapEmptyMap = this.sliceDataMap;
        if (mapEmptyMap == null) {
            mapEmptyMap = MapsKt__MapsKt.emptyMap();
        }
        linkedHashMap2.putAll(mapEmptyMap);
        linkedHashMap2.put("slice_item_actions", this.sliceItemActions);
        linkedHashMap2.put("slice_item_states", linkedHashMap);
        linkedHashMap2.put("slice_item_extra", this.sliceItemExtra);
        Map mapMapOf = MapsKt__MapsJVMKt.mapOf(TuplesKt.to("data", linkedHashMap2));
        C35640Msx.LIZ.getClass();
        C35630Msw c35630MswLIZ = C35640Msx.LIZ("ECShopInfoTotalAreaSlicePresenter");
        StringBuilder sb = StringBuilderCache.get();
        sb.append("bindData, sliceItemStates: ");
        sb.append(this.sliceItemStates);
        c35630MswLIZ.LIZ(StringBuilderCache.release(sb));
        C35630Msw c35630MswLIZ2 = C35640Msx.LIZ("ECShopInfoTotalAreaSlicePresenter");
        StringBuilder sb2 = StringBuilderCache.get();
        sb2.append("bindData, dataCtx sliceItemStates: ");
        Object obj2 = mapMapOf.get("data");
        if (obj2 != null && (mapLJIILJJIL = 0iZM.LJIILJJIL(obj2)) != null) {
            obj = mapLJIILJJIL.get("slice_item_states");
        } else {
            obj = null;
        }
        sb2.append(obj);
        c35630MswLIZ2.LIZ(StringBuilderCache.release(sb2));
        SlcTemplateViewInfo slcTemplateViewInfo = this.viewInfo;
        if (slcTemplateViewInfo != null) {
            slcTemplateViewInfo.bindData(mapMapOf, EnumC20080MLj.SHOP_TOP_BAR.getId());
        }
    }

    public final float LLLZZIL() {
        C20420MMr c20420MMr = (C20420MMr) LLLLL().T1.getValue();
        Object obj = LLLLL().va.LIZ.get(Reflection.getOrCreateKotlinClass(C0MNT.class));
        View view = null;
        if (!(obj instanceof C0MNT)) {
            obj = null;
        }
        C0MNT c0mnt = (C0MNT) obj;
        if (c0mnt != null) {
            view = ((C20400MMp) c0mnt).LIZ.shopLogoView;
        }
        View view2 = this.topBarInnerView;
        if (view2 == null || !view2.isShown() || view2.getHeight() <= 0) {
            view2 = this.sliceContainerView;
        }
        if (view != null && view2 != null && view.getHeight() > 0 && view2.getHeight() > 0) {
            if (c20420MMr != null) {
                if (c20420MMr.LIZIZ > 0) {
                    GlobalProxyLancet.J(view, this.headerInfoLocation);
                    GlobalProxyLancet.J(view2, this.topBarLocation);
                    int iCoerceAtLeast = RangesKt.coerceAtLeast((this.topBarLocation[1] + view2.getHeight()) - (this.headerInfoLocation[1] + view.getHeight()), 0);
                    int iCoerceAtLeast2 = RangesKt.coerceAtLeast(c20420MMr.LIZIZ - c20420MMr.LIZ, 0) + iCoerceAtLeast;
                    if (iCoerceAtLeast2 <= 0) {
                        return 1.0f;
                    }
                    return iCoerceAtLeast / iCoerceAtLeast2;
                }
            } else {
                return 0.0f;
            }
        } else if (c20420MMr == null) {
            return 0.0f;
        }
        int i = c20420MMr.LIZIZ;
        if (i > 0 && c20420MMr.LIZ >= i) {
            return 1.0f;
        }
        return 0.0f;
    }

    public final void LLZL() {
        int i;
        View view;
        Float fValueOf;
        View view2;
        if (Intrinsics.areEqual(LLLLL().T.getValue(), Boolean.TRUE) && !LLLLL().yE()) {
            ECStoreCollapsibleTextView eCStoreCollapsibleTextView = this.searchView;
            if (eCStoreCollapsibleTextView != null) {
                AbstractC40290N1c.LIZJ(eCStoreCollapsibleTextView);
            }
            View view3 = this.sliceInfoView;
            if (view3 != null) {
                AbstractC40290N1c.LIZJ(view3);
                return;
            }
            return;
        }
        if (LLLLL().yE()) {
            if (LLLJ()) {
                View view4 = this.sliceInfoView;
                if (view4 != null) {
                    AbstractC40290N1c.LIZLLL(view4);
                }
            } else {
                float fLLLZZIL = LLLZZIL();
                if (fLLLZZIL > 0.0f) {
                    i = 0;
                } else {
                    i = 4;
                }
                View view5 = this.sliceInfoView;
                if ((view5 == null || view5.getVisibility() != i) && (view = this.sliceInfoView) != null) {
                    view.setVisibility(i);
                }
                View view6 = this.sliceInfoView;
                if (view6 != null) {
                    fValueOf = Float.valueOf(view6.getAlpha());
                } else {
                    fValueOf = null;
                }
                if (!Intrinsics.areEqual(fValueOf, fLLLZZIL) && (view2 = this.sliceInfoView) != null) {
                    view2.setAlpha(fLLLZZIL);
                }
            }
        } else {
            View view7 = this.sliceInfoView;
            if (view7 != null) {
                AbstractC40290N1c.LIZLLL(view7);
            }
        }
        ECStoreCollapsibleTextView eCStoreCollapsibleTextView2 = this.searchView;
        if (eCStoreCollapsibleTextView2 == null) {
            return;
        }
        AbstractC40290N1c.LIZLLL(eCStoreCollapsibleTextView2);
    }

    public final void LLZILL() {
        View view;
        View viewFindViewBySliceKey;
        View viewFindViewBySliceKey2;
        View viewFindViewBySliceKey3;
        View contentView;
        ECStoreCollapsibleTextView eCStoreCollapsibleTextView;
        0jFc r1;
        SlcTemplateContext slcTemplateContext;
        SlcRenderContext slcRenderContext;
        SlcTemplateContext slcTemplateContext2;
        SlcRenderContext slcRenderContext2;
        SlcTemplateContext slcTemplateContext3;
        SlcRenderContext slcRenderContext3;
        if (this.isInitedView) {
            return;
        }
        this.isInitedView = true;
        SlcTemplateViewInfo slcTemplateViewInfo = this.viewInfo;
        if (slcTemplateViewInfo != null && (view = slcTemplateViewInfo.getView()) != null) {
            FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(-1, -2);
            layoutParams.gravity = 17;
            ViewGroup viewGroup = this.sliceContainerView;
            if (viewGroup != null) {
                viewGroup.addView(view, layoutParams);
            }
            SlcTemplateViewInfo slcTemplateViewInfo2 = this.viewInfo;
            C0MKP c0mkpLJIILL = null;
            if (slcTemplateViewInfo2 != null && (slcTemplateContext3 = slcTemplateViewInfo2.LIZIZ) != null && (slcRenderContext3 = slcTemplateContext3.LJIL) != null) {
                viewFindViewBySliceKey = slcRenderContext3.findViewBySliceKey(view, EnumC20410MMq.SHARE_BUTTON.LIZ());
            } else {
                viewFindViewBySliceKey = null;
            }
            this.shareButtonView = viewFindViewBySliceKey;
            SlcTemplateViewInfo slcTemplateViewInfo3 = this.viewInfo;
            if (slcTemplateViewInfo3 != null && (slcTemplateContext2 = slcTemplateViewInfo3.LIZIZ) != null && (slcRenderContext2 = slcTemplateContext2.LJIL) != null) {
                viewFindViewBySliceKey2 = slcRenderContext2.findViewBySliceKey(view, EnumC20410MMq.SLICE_INFO.LIZ());
            } else {
                viewFindViewBySliceKey2 = null;
            }
            this.sliceInfoView = viewFindViewBySliceKey2;
            SlcTemplateViewInfo slcTemplateViewInfo4 = this.viewInfo;
            if (slcTemplateViewInfo4 != null && (slcTemplateContext = slcTemplateViewInfo4.LIZIZ) != null && (slcRenderContext = slcTemplateContext.LJIL) != null) {
                viewFindViewBySliceKey3 = slcRenderContext.findViewBySliceKey(view, EnumC20410MMq.SHOP_SEARCH.LIZ());
            } else {
                viewFindViewBySliceKey3 = null;
            }
            if ((viewFindViewBySliceKey3 instanceof 0jFc) && (r1 = (0jFc) viewFindViewBySliceKey3) != null) {
                contentView = r1.getContentView();
            } else {
                contentView = null;
            }
            if (contentView instanceof ECStoreCollapsibleTextView) {
                eCStoreCollapsibleTextView = (ECStoreCollapsibleTextView) contentView;
            } else {
                eCStoreCollapsibleTextView = null;
            }
            this.searchView = eCStoreCollapsibleTextView;
            if (!LLLLLIL()) {
                View view2 = this.shareButtonView;
                C0MLL c0mll = (C0MLL) LLLLL().q.getValue();
                if (c0mll != null) {
                    c0mkpLJIILL = c0mll.LJIILL();
                }
                if (view2 != null && c0mkpLJIILL != null) {
                    Lazy lazy = C0MN0.LIZIZ;
                    C0MGT.LIZ().LIZ(LLLLL().h.M1, C0MN6.AFTER_FIRST_SCREEN, new ALambdaS757S0300000_13(c0mkpLJIILL, view2, this, 7));
                }
            }
            ECStoreCollapsibleTextView eCStoreCollapsibleTextView2 = this.searchView;
            if (eCStoreCollapsibleTextView2 != null) {
                GlobalProxyLancet.C0(new ACListenerS851S0100000_13(this, 12), eCStoreCollapsibleTextView2);
            }
            ECStoreCollapsibleTextView eCStoreCollapsibleTextView3 = this.searchView;
            if (eCStoreCollapsibleTextView3 != null) {
                eCStoreCollapsibleTextView3.setSearchTextViewListener(new ACListenerS851S0100000_13(this, 15));
            }
            ECStoreCollapsibleTextView eCStoreCollapsibleTextView4 = this.searchView;
            if (eCStoreCollapsibleTextView4 != null) {
                eCStoreCollapsibleTextView4.setSearchCameraClickListener(new ACListenerS851S0100000_13(this, 17));
            }
            ECStoreCollapsibleTextView eCStoreCollapsibleTextView5 = this.searchView;
            if (eCStoreCollapsibleTextView5 != null && eCStoreCollapsibleTextView5.f) {
                BtmSDK btmSDK = BtmSDK.INSTANCE;
                PageFinder pageFinderVia = PageFinder.via(getView());
                Intrinsics.checkNotNullExpressionValue(pageFinderVia, "");
                Map mapCreateReportParams = btmSDK.createReportParams("a1.b6269.c5887.d51683", pageFinderVia);
                ArrayList arrayList = new ArrayList(mapCreateReportParams.size());
                for (Map.Entry entry : mapCreateReportParams.entrySet()) {
                    arrayList.add(TuplesKt.to(entry.getKey(), String.valueOf(entry.getValue())));
                }
                LLLLL().z0("photo_search_icon_show", MapsKt__MapsKt.toMap(arrayList), TuplesKt.to("current_page", "shop_search_page"));
            }
            LLLLL().xb("show_search", TuplesKt.to("enter_from", "search_store"));
            LLZL();
        }
    }

    public final void LLZLLLL(C0MK0 c0mk0) {
        C0MK7.LIZ(this.sliceItemStates, c0mk0, "ECShopSliceTopInfoPresenter");
    }

    public final void LLZZLLIL(float f) {
        if (Intrinsics.areEqual(this.sliceItemStates.get("profile_scroll_percent"), Float.valueOf(f))) {
            return;
        }
        this.sliceItemStates.put("profile_scroll_percent", Float.valueOf(f));
        LLLZZ();
    }

    public ECShopSliceTopBarPresenter(Fragment fragment) {
        super(fragment);
        this.headerInfoLocation = new int[2];
        this.topBarLocation = new int[2];
        this.sliceItemStates = new LinkedHashMap();
        this.slcActionHandler$delegate = LazyKt__LazyJVMKt.lazy(new ALambdaS1716S0200000_13(this, fragment, 27));
    }

    public final void LLZIL(C20050MLg c20050MLg) {
        LLLLL().cE().LIZIZ(C0MM0.LIZ(c20050MLg));
        C20000MLb c20000MLbBE = LLLLL().bE();
        String strLIZLLL = c20050MLg.LIZLLL();
        c20000MLbBE.getClass();
        SlcTemplateViewInfo slcTemplateViewInfoLIZJ = c20000MLbBE.LIZJ("createTopInfoCard", new ALambdaS275S1000000_13(strLIZLLL, 9));
        this.viewInfo = slcTemplateViewInfoLIZJ;
        if (slcTemplateViewInfoLIZJ != null) {
            slcTemplateViewInfoLIZJ.setActionHandler((C0MV2) this.slcActionHandler$delegate.getValue());
        }
    }

    public final void onBind(QModel qModel) {
        ViewGroup viewGroup;
        View view = getView();
        if (view instanceof ViewGroup) {
            viewGroup = (ViewGroup) view;
        } else {
            viewGroup = null;
        }
        this.sliceContainerView = viewGroup;
        this.topBarInnerView = GlobalProxyLancet.E(2131376100, LLLZLL());
        LLLLL().q.LIZ(LLLLLJLJLL(), new Observer() { // from class: com.bytedance.android.shopping.store.home.presenter.ECShopSliceTopBarPresenter.onBind.1
            public final void onChanged(Object obj) {
                C0MLL c0mll = (C0MLL) obj;
                CheckNpeV2.throwNpe1(c0mll, 0);
                if (c0mll.LJIJJLI() && !c0mll.LJIJJ()) {
                    ViewGroup viewGroup2 = ECShopSliceTopBarPresenter.this.sliceContainerView;
                    if (viewGroup2 != null) {
                        AbstractC40290N1c.LIZLLL(viewGroup2);
                    }
                    C20050MLg c20050MLgLJI = c0mll.LJI();
                    if (c20050MLgLJI != null) {
                        final ECShopSliceTopBarPresenter eCShopSliceTopBarPresenter = ECShopSliceTopBarPresenter.this;
                        eCShopSliceTopBarPresenter.LLZIL(c20050MLgLJI);
                        eCShopSliceTopBarPresenter.LLZLI(c20050MLgLJI, c0mll.LJIIIZ());
                        if (eCShopSliceTopBarPresenter.bindDataListener == null) {
                            ISlcBindDataListener iSlcBindDataListener = new ISlcBindDataListener() { // from class: com.bytedance.android.shopping.store.home.presenter.ECShopSliceTopBarPresenter$onBind$1$1$1
                                public final void LIZ(SlcTemplateContext slcTemplateContext, String str, Throwable th) {
                                    CheckNpeV2.throwNpe1(slcTemplateContext, 0);
                                    if (Intrinsics.areEqual(str, EnumC20080MLj.SHOP_TOP_BAR.getId())) {
                                        eCShopSliceTopBarPresenter.LLZILL();
                                        eCShopSliceTopBarPresenter.LLZL();
                                    }
                                }
                            };
                            C22530MUu c22530MUu = (C22530MUu) eCShopSliceTopBarPresenter.LLLLL().cE();
                            c22530MUu.getClass();
                            CheckNpeV2.throwNpe1(iSlcBindDataListener, 0);
                            SlcRenderContext slcRenderContext = c22530MUu.LIZ;
                            if (slcRenderContext != null) {
                                0jNK.LIZ();
                                ArrayList arrayList = slcRenderContext.LJIILIIL;
                                if (arrayList == null) {
                                    arrayList = new ArrayList();
                                    slcRenderContext.LJIILIIL = arrayList;
                                }
                                GlobalProxyLancet.LLLZLZ(iSlcBindDataListener, arrayList);
                            }
                            eCShopSliceTopBarPresenter.bindDataListener = iSlcBindDataListener;
                        }
                        eCShopSliceTopBarPresenter.LLLZZ();
                        eCShopSliceTopBarPresenter.LLZL();
                    }
                    C22040MSx c22040MSx = ECShopSliceTopBarPresenter.this.LLLLL().P;
                    LifecycleOwner lifecycleOwnerLLLLLJLJLL = ECShopSliceTopBarPresenter.this.LLLLLJLJLL();
                    final ECShopSliceTopBarPresenter eCShopSliceTopBarPresenter2 = ECShopSliceTopBarPresenter.this;
                    c22040MSx.LIZ(lifecycleOwnerLLLLLJLJLL, new Observer() { // from class: com.bytedance.android.shopping.store.home.presenter.ECShopSliceTopBarPresenter.onBind.1.2
                        public final void onChanged(Object obj2) {
                            C0MK0 c0mk0 = (C0MK0) obj2;
                            CheckNpeV2.throwNpe1(c0mk0, 0);
                            eCShopSliceTopBarPresenter2.LLZLLLL(c0mk0);
                            eCShopSliceTopBarPresenter2.LLLZZ();
                        }
                    }, false);
                    C22040MSx c22040MSx2 = ECShopSliceTopBarPresenter.this.LLLLL().P1;
                    LifecycleOwner lifecycleOwnerLIZ = AbstractC16950M9i.LIZ(ECShopSliceTopBarPresenter.this.getQContext());
                    final ECShopSliceTopBarPresenter eCShopSliceTopBarPresenter3 = ECShopSliceTopBarPresenter.this;
                    c22040MSx2.LIZ(lifecycleOwnerLIZ, new Observer() { // from class: com.bytedance.android.shopping.store.home.presenter.ECShopSliceTopBarPresenter.onBind.1.3
                        public final void onChanged(Object obj2) {
                            float fFloatValue = ((Number) obj2).floatValue();
                            if (!eCShopSliceTopBarPresenter3.LLLLL().yE()) {
                                eCShopSliceTopBarPresenter3.LLZZLLIL(fFloatValue);
                            }
                        }
                    }, false);
                    C22040MSx c22040MSx3 = ECShopSliceTopBarPresenter.this.LLLLL().T1;
                    LifecycleOwner lifecycleOwnerLIZ2 = AbstractC16950M9i.LIZ(ECShopSliceTopBarPresenter.this.getQContext());
                    final ECShopSliceTopBarPresenter eCShopSliceTopBarPresenter4 = ECShopSliceTopBarPresenter.this;
                    c22040MSx3.LIZ(lifecycleOwnerLIZ2, new Observer() { // from class: com.bytedance.android.shopping.store.home.presenter.ECShopSliceTopBarPresenter.onBind.1.4
                        public final void onChanged(Object obj2) {
                            if (eCShopSliceTopBarPresenter4.LLLLL().yE()) {
                                eCShopSliceTopBarPresenter4.LLZZ();
                            }
                        }
                    }, false);
                    C22040MSx c22040MSx4 = ECShopSliceTopBarPresenter.this.LLLLL().V1;
                    LifecycleOwner lifecycleOwnerLIZ3 = AbstractC16950M9i.LIZ(ECShopSliceTopBarPresenter.this.getQContext());
                    final ECShopSliceTopBarPresenter eCShopSliceTopBarPresenter5 = ECShopSliceTopBarPresenter.this;
                    c22040MSx4.LIZ(lifecycleOwnerLIZ3, new Observer() { // from class: com.bytedance.android.shopping.store.home.presenter.ECShopSliceTopBarPresenter.onBind.1.5
                        public final void onChanged(Object obj2) {
                            if (eCShopSliceTopBarPresenter5.LLLLL().yE()) {
                                eCShopSliceTopBarPresenter5.LLZZ();
                            }
                        }
                    }, false);
                    C22040MSx c22040MSx5 = ECShopSliceTopBarPresenter.this.LLLLL().T;
                    LifecycleOwner lifecycleOwnerLLLLLJLJLL2 = ECShopSliceTopBarPresenter.this.LLLLLJLJLL();
                    final ECShopSliceTopBarPresenter eCShopSliceTopBarPresenter6 = ECShopSliceTopBarPresenter.this;
                    c22040MSx5.LIZ(lifecycleOwnerLLLLLJLJLL2, new Observer() { // from class: com.bytedance.android.shopping.store.home.presenter.ECShopSliceTopBarPresenter.onBind.1.6
                        public final void onChanged(Object obj2) {
                            eCShopSliceTopBarPresenter6.LLZL();
                        }
                    }, false);
                    C22040MSx c22040MSx6 = ECShopSliceTopBarPresenter.this.LLLLL().ab;
                    LifecycleOwner lifecycleOwnerLLLLLJLJLL3 = ECShopSliceTopBarPresenter.this.LLLLLJLJLL();
                    final ECShopSliceTopBarPresenter eCShopSliceTopBarPresenter7 = ECShopSliceTopBarPresenter.this;
                    c22040MSx6.LIZ(lifecycleOwnerLLLLLJLJLL3, new Observer() { // from class: com.bytedance.android.shopping.store.home.presenter.ECShopSliceTopBarPresenter.onBind.1.7
                        public final void onChanged(Object obj2) {
                            eCShopSliceTopBarPresenter7.LLZL();
                        }
                    }, false);
                    C22040MSx c22040MSx7 = ECShopSliceTopBarPresenter.this.LLLLL().B;
                    LifecycleOwner lifecycleOwnerLLLLLJLJLL4 = ECShopSliceTopBarPresenter.this.LLLLLJLJLL();
                    final ECShopSliceTopBarPresenter eCShopSliceTopBarPresenter8 = ECShopSliceTopBarPresenter.this;
                    c22040MSx7.LIZ(lifecycleOwnerLLLLLJLJLL4, new Observer() { // from class: com.bytedance.android.shopping.store.home.presenter.ECShopSliceTopBarPresenter.onBind.1.8
                        public final void onChanged(Object obj2) {
                            List listLIZIZ;
                            C21350MQg c21350MQg;
                            ECStoreCollapsibleTextView eCStoreCollapsibleTextView;
                            String strLIZLLL;
                            TextView textView;
                            ECTopSearchInfo eCTopSearchInfo = (ECTopSearchInfo) obj2;
                            if (eCTopSearchInfo != null && (listLIZIZ = eCTopSearchInfo.LIZIZ()) != null && (c21350MQg = (C21350MQg) CollectionsKt___CollectionsKt.firstOrNull(listLIZIZ)) != null && (eCStoreCollapsibleTextView = eCShopSliceTopBarPresenter8.searchView) != null && (strLIZLLL = c21350MQg.LIZLLL()) != null && !StringsKt__StringsKt.isBlank(strLIZLLL)) {
                                C0MP4 c0mp4LJIIIIZZ = eCStoreCollapsibleTextView.LJIIIIZZ(strLIZLLL);
                                eCStoreCollapsibleTextView.n = c0mp4LJIIIIZZ;
                                c0mp4LJIIIIZZ.LIZ(0.0f);
                                View view2 = eCStoreCollapsibleTextView.g;
                                if ((view2 instanceof TextView) && (textView = (TextView) view2) != null) {
                                    textView.setText(eCStoreCollapsibleTextView.n);
                                }
                            }
                        }
                    }, false);
                    return;
                }
                ViewGroup viewGroup3 = ECShopSliceTopBarPresenter.this.sliceContainerView;
                if (viewGroup3 == null) {
                    return;
                }
                AbstractC40290N1c.LIZJ(viewGroup3);
            }
        }, false);
    }

    public final void LLZLI(C20050MLg c20050MLg, C19920MKt c19920MKt) {
        C20240MLz c20240MLz;
        Map<String, Object> mutableMap;
        this.sliceDataMap = c20050MLg.LIZ();
        Map mapLIZJ = c20050MLg.LIZJ();
        if (mapLIZJ != null && (c20240MLz = (C20240MLz) mapLIZJ.get(EnumC20040MLf.SHOP_TOP_BAR.getType())) != null) {
            Map mapLIZ = c20240MLz.LIZ();
            Map<String, Object> mutableMap2 = null;
            if (mapLIZ != null) {
                mutableMap = MapsKt__MapsKt.toMutableMap(mapLIZ);
            } else {
                mutableMap = null;
            }
            this.sliceItemActions = mutableMap;
            Map mapLIZJ2 = c20240MLz.LIZJ();
            if (mapLIZJ2 != null) {
                mutableMap2 = MapsKt__MapsKt.toMutableMap(mapLIZJ2);
            }
            this.sliceItemExtra = mutableMap2;
        }
        C0MK8.LIZ(this.sliceItemStates, C0MK8.LIZIZ(c19920MKt));
        C35640Msx.LIZ.getClass();
        C35630Msw c35630MswLIZ = C35640Msx.LIZ("ECShopInfoTotalAreaSlicePresenter");
        StringBuilder sb = StringBuilderCache.get();
        sb.append("updateFollowStateFromAccountInfo, sliceItemStates: ");
        sb.append(this.sliceItemStates);
        c35630MswLIZ.LIZ(StringBuilderCache.release(sb));
    }
}
