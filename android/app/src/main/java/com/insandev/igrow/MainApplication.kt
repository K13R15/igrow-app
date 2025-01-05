package com.insandev.igrow;

import android.app.Application;
import android.content.res.Configuration;

import com.facebook.react.PackageList;
import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.ReactHost;
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint;
import com.facebook.react.defaults.DefaultReactNativeHost;
import com.facebook.soloader.SoLoader;

import io.invertase.firebase.messaging.ReactNativeFirebaseMessagingPackage;  // Firebase import

import expo.modules.ApplicationLifecycleDispatcher;
import expo.modules.ReactNativeHostWrapper;

class MainApplication extends Application implements ReactApplication {

  @Override
  public ReactNativeHost getReactNativeHost() {
    return new ReactNativeHostWrapper(
        this,
        new DefaultReactNativeHost(this) {
          @Override
          public List<ReactPackage> getPackages() {
            List<ReactPackage> packages = new PackageList(this).getPackages();
            // Manually add Firebase Messaging Package
            packages.add(new ReactNativeFirebaseMessagingPackage());
            return packages;
          }

          @Override
          public String getJSMainModuleName() {
            return ".expo/.virtual-metro-entry";
          }

          @Override
          public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
          }

          @Override
          public boolean isNewArchEnabled() {
            return BuildConfig.IS_NEW_ARCHITECTURE_ENABLED;
          }

          @Override
          public boolean isHermesEnabled() {
            return BuildConfig.IS_HERMES_ENABLED;
          }
        }
    );
  }

  @Override
  public ReactHost getReactHost() {
    return ReactNativeHostWrapper.createReactHost(getApplicationContext(), getReactNativeHost());
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, false);
    if (BuildConfig.IS_NEW_ARCHITECTURE_ENABLED) {
      DefaultNewArchitectureEntryPoint.load();
    }
    ApplicationLifecycleDispatcher.onApplicationCreate(this);
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    ApplicationLifecycleDispatcher.onConfigurationChanged(this, newConfig);
  }
}
