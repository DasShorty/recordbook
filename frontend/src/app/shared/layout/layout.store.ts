import {patchState, signalStore, withMethods, withState} from '@ngrx/signals';

export const LayoutStore = signalStore(
  {providedIn: 'root'},
  withState({
    menuOpen: true as boolean
  }),
  withMethods((store) => {
    return {

      toggleMenu() {

        patchState(store, {
          menuOpen: !store.menuOpen()
        });

      },

      isMenuVisible() {
        return store.menuOpen();
      }

    }
  })
)
