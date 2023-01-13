// See https://kit.svelte.dev/docs/types#app
import { User } from '$lib/types';
// for information about these interfaces
// and what to do when importing types

declare global {
    namespace App {
        // interface Error {}
        interface Locals {
            user: User
        }
        // interface PageData {}
        // interface Platform {}
    }
}


