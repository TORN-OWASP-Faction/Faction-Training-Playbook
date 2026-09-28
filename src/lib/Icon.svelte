<script>
  // Lucide icons (ISC), one import each so only these end up in the site.
  import ArrowDownIcon from '@lucide/svelte/icons/arrow-down';
  import ArrowLeftRightIcon from '@lucide/svelte/icons/arrow-left-right';
  import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
  import ArrowUpIcon from '@lucide/svelte/icons/arrow-up';
  import BackpackIcon from '@lucide/svelte/icons/backpack';
  import BanIcon from '@lucide/svelte/icons/ban';
  import BookIcon from '@lucide/svelte/icons/book';
  import BookOpenIcon from '@lucide/svelte/icons/book-open';
  import BuildingIcon from '@lucide/svelte/icons/building';
  import CheckIcon from '@lucide/svelte/icons/check';
  import ChevronsUpIcon from '@lucide/svelte/icons/chevrons-up';
  import CircleQuestionMarkIcon from '@lucide/svelte/icons/circle-question-mark';
  import CoinsIcon from '@lucide/svelte/icons/coins';
  import CompassIcon from '@lucide/svelte/icons/compass';
  import DicesIcon from '@lucide/svelte/icons/dices';
  import DollarSignIcon from '@lucide/svelte/icons/dollar-sign';
  import DropletIcon from '@lucide/svelte/icons/droplet';
  import DumbbellIcon from '@lucide/svelte/icons/dumbbell';
  import EqualIcon from '@lucide/svelte/icons/equal';
  import EqualApproximatelyIcon from '@lucide/svelte/icons/equal-approximately';
  import EqualNotIcon from '@lucide/svelte/icons/equal-not';
  import FlagIcon from '@lucide/svelte/icons/flag';
  import FuelIcon from '@lucide/svelte/icons/fuel';
  import GemIcon from '@lucide/svelte/icons/gem';
  import GhostIcon from '@lucide/svelte/icons/ghost';
  import GlobeIcon from '@lucide/svelte/icons/globe';
  import GraduationCapIcon from '@lucide/svelte/icons/graduation-cap';
  import HospitalIcon from '@lucide/svelte/icons/hospital';
  import KeyRoundIcon from '@lucide/svelte/icons/key-round';
  import LandmarkIcon from '@lucide/svelte/icons/landmark';
  import LayersIcon from '@lucide/svelte/icons/layers';
  import LinkIcon from '@lucide/svelte/icons/link';
  import MenuIcon from '@lucide/svelte/icons/menu';
  import MinusIcon from '@lucide/svelte/icons/minus';
  import PercentIcon from '@lucide/svelte/icons/percent';
  import PillIcon from '@lucide/svelte/icons/pill';
  import PlaneIcon from '@lucide/svelte/icons/plane';
  import PlusIcon from '@lucide/svelte/icons/plus';
  import RefreshCwIcon from '@lucide/svelte/icons/refresh-cw';
  import RotateCcwIcon from '@lucide/svelte/icons/rotate-ccw';
  import RouteIcon from '@lucide/svelte/icons/route';
  import SettingsIcon from '@lucide/svelte/icons/settings';
  import SigmaIcon from '@lucide/svelte/icons/sigma';
  import SkullIcon from '@lucide/svelte/icons/skull';
  import SmartphoneIcon from '@lucide/svelte/icons/smartphone';
  import SmileIcon from '@lucide/svelte/icons/smile';
  import StarIcon from '@lucide/svelte/icons/star';
  import SwordsIcon from '@lucide/svelte/icons/swords';
  import TimerIcon from '@lucide/svelte/icons/timer';
  import TreePalmIcon from '@lucide/svelte/icons/tree-palm';
  import TrendingDownIcon from '@lucide/svelte/icons/trending-down';
  import TrendingUpIcon from '@lucide/svelte/icons/trending-up';
  import TriangleAlertIcon from '@lucide/svelte/icons/triangle-alert';
  import Undo2Icon from '@lucide/svelte/icons/undo-2';
  import WrenchIcon from '@lucide/svelte/icons/wrench';
  import XIcon from '@lucide/svelte/icons/x';
  import ZapIcon from '@lucide/svelte/icons/zap';

  let { name, size = 15 } = $props();

  const ICONS = {
    hospital: HospitalIcon,
    pill: PillIcon,
    skull: SkullIcon,
    droplet: DropletIcon,
    revive: RotateCcwIcon,
    phone: SmartphoneIcon,
    grad: GraduationCapIcon,
    backpack: BackpackIcon,
    building: BuildingIcon,
    fuel: FuelIcon,
    flag: FlagIcon,
    smile: SmileIcon,
    timer: TimerIcon,
    plus: PlusIcon,
    globe: GlobeIcon,
    menu: MenuIcon,
    x: XIcon,
    link: LinkIcon,
    ghost: GhostIcon,
    compass: CompassIcon,
    dumbbell: DumbbellIcon,
    coins: CoinsIcon,
    route: RouteIcon,
    book: BookIcon,
    wrench: WrenchIcon,
    check: CheckIcon,
    star: StarIcon,
    plane: PlaneIcon,
    up: ArrowUpIcon,
    down: ArrowDownIcon,
    right: ArrowRightIcon,
    swap: ArrowLeftRightIcon,
    refresh: RefreshCwIcon,
    undo: Undo2Icon,
    alert: TriangleAlertIcon,
    swords: SwordsIcon,
    percent: PercentIcon,
    sigma: SigmaIcon,
    settings: SettingsIcon,
    help: CircleQuestionMarkIcon,
    dollar: DollarSignIcon,
    key: KeyRoundIcon,
    gem: GemIcon,
    ban: BanIcon,
    'not-equal': EqualNotIcon,
    approx: EqualApproximatelyIcon,
    zap: ZapIcon,
    'trending-down': TrendingDownIcon,
    'trending-up': TrendingUpIcon,
    minus: MinusIcon,
    equal: EqualIcon,
    bank: LandmarkIcon,
    dice: DicesIcon,
    palm: TreePalmIcon,
    'book-open': BookOpenIcon,
    layers: LayersIcon,
    'chevrons-up': ChevronsUpIcon
  };
  const Svg = $derived(ICONS[name]);
</script>

{#if Svg}<Svg class="ico" {size} strokeWidth={2} aria-hidden="true" />{/if}

<style>
  :global(.ico){display:block;flex:none}
</style>
